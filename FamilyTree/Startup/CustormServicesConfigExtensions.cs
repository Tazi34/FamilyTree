using FamilyTree.Services;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class CustormServicesConfigExtensions
    {
        public static IServiceCollection AddCustomServices(this IServiceCollection services)
        {
            services.AddSingleton<IConnectionsService, ConnectionsService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ITreeService, TreeService>();
            services.AddScoped<IBlogService, BlogService>();
            services.AddScoped<IChatService, ChatService>();
            services.AddScoped<IPasswordService, PasswordService>();
            services.AddScoped<IFacebookService, FacebookService>();
            services.AddScoped<ITreeAuthService, TreeAuthService>();
            services.AddScoped<ITreeValidationService, TreeValidationService>();
            services.AddScoped<IGoogleService, GoogleService>();
            services.AddScoped<ISearchService, SearchService>();
            return services;
        }
    }
}
