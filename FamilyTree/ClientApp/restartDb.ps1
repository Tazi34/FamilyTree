
Get-Content .\db_copy.json | Set-Content .\db.json
json-server db.json -m ./node_modules/json-server-auth
