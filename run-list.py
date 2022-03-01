import requests
import json

with open("sample.txt", "a") as file_out:
    with open("plate-list.txt") as file_in:
        lines = []
        for line in file_in:
            response = requests.get("http://localhost:8083/search?plate="+line+"&state=vic")
            response.raise_for_status()
            try:
                jsonresp = json.loads(response.text)
                rego = jsonresp["active"]
                print(rego)
            except:
                print("NOT FOUND")
                rego = "NOT FOUND"
            lines.append(rego)
        with open('output.txt', 'w') as filehandle:
            for listitem in lines:
                filehandle.write('%s\n' % listitem)