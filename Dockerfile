# Étape de build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copier le fichier solution et restaurer les dépendances
COPY *.sln ./
COPY FIX/*.csproj ./FIX/
# Ajoute ici les autres .csproj si nécessaires
RUN dotnet restore

# Copier tout le reste et builder
COPY . ./
RUN dotnet publish -c Release -o out

# Étape finale : Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

# Port exposé pour l'API ou le moteur FIX
EXPOSE 8080
ENTRYPOINT ["dotnet", "FIX4NET.dll"]
