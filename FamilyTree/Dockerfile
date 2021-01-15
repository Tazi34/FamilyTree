#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
RUN apt-get update -yq && apt-get upgrade -yq && apt-get install -yq curl git nano

COPY ./ /app

WORKDIR /app

ENV NODE_ENV production

EXPOSE 80/tcp

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["FamilyTree/FamilyTree.csproj", "FamilyTree/"]
RUN dotnet restore "FamilyTree/FamilyTree.csproj"
COPY . .
WORKDIR "/src/FamilyTree"
RUN dotnet build "FamilyTree.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "FamilyTree.csproj" -c Release -o /app/publish
ENV ASPNETCORE_ENVIRONMENT="docker"
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY ./wait-for-it2.sh .
COPY ./wait-for-it2.sh /app
RUN chmod +x wait-for-it2.sh
CMD /bin/bash ./wait-for-it2.sh db:1433 -t 120 -- dotnet FamilyTree.dll --server.urls http://*:80
