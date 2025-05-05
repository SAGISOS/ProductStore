using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Security.Claims;

namespace ProductStoreAPI.Hubs
{
    [Authorize]
    public class OnlineUsersHub : Hub
    {
        private static readonly ConcurrentDictionary<string, UserInfo> _onlineUsers = new();
        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var username = Context.User?.FindFirst(ClaimTypes.Name)?.Value;
            var isAdmin = Context.User?.FindFirst("IsAdmin")?.Value?.ToLower() == "true";

            if (!string.IsNullOrEmpty(userId) && !string.IsNullOrEmpty(username))
            {
                var userInfo = new UserInfo
                {
                    UserId = userId,
                    Username = username,
                    ConnectionId = Context.ConnectionId,
                    IsAdmin = isAdmin,
                    ConnectedAt = DateTime.Now
                };

                _onlineUsers.TryAdd(Context.ConnectionId, userInfo);
                await SendOnlineUsersToAdmins();
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _onlineUsers.TryRemove(Context.ConnectionId, out _);
            await SendOnlineUsersToAdmins();
            await base.OnDisconnectedAsync(exception);
        }

        private async Task SendOnlineUsersToAdmins()
        {
            var adminConnections = _onlineUsers.Where(u => u.Value.IsAdmin).Select(u => u.Key);
            if (adminConnections.Any())
            {
                var users = _onlineUsers.Values.Select(u => new
                {
                    u.UserId,
                    u.Username,
                    u.ConnectedAt,
                    u.IsAdmin
                }).ToList();
                
                foreach (var connectionId in adminConnections)
                {
                    await Clients.Client(connectionId).SendAsync("ReceiveOnlineUsers", users);
                }
            }
        }

        [Authorize(Policy = "AdminOnly")]
        public async Task GetOnlineUsers()
        {
            var users = _onlineUsers.Values.Select(u => new
            {
                u.UserId,
                u.Username,
                u.ConnectedAt,
                u.IsAdmin
            }).ToList();
            
            await Clients.Caller.SendAsync("ReceiveOnlineUsers", users);
        }
    }

    public class UserInfo
    {
        public string UserId { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string ConnectionId { get; set; } = string.Empty;
        public bool IsAdmin { get; set; }
        public DateTime ConnectedAt { get; set; }
    }
} 