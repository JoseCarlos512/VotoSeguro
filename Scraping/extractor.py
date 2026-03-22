import requests
import json

URL_API = "https://web.jne.gob.pe/serviciovotoinformado/api/votoinf/listarCanditatos"

def fetch_data(tipo_eleccion):
    payload = {
        "idProcesoElectoral": 124,
        "idTipoEleccion": tipo_eleccion,
        "strUbiDepartamento": ""
    }
    headers = {'User-Agent': 'Mozilla/5.0', 'Content-Type': 'application/json'}
    try:
        response = requests.post(URL_API, json=payload, headers=headers)
        return response.json().get('data', [])
    except:
        return []

def generate_ts_structure():
    raw_presi = fetch_data(1)  # Presidenciales y Vice
    raw_senadores = fetch_data(20) # Senadores

    partidos = {}

    # 1. Procesar Presidenciales y Vicepresidentes
    for item in raw_presi:
        p_id = item['idOrganizacionPolitica']
        cargo_id = item['idCargo']
        nombre = f"{item['strNombres']} {item['strApellidoPaterno']} {item['strApellidoMaterno']}".strip().title()
        
        if p_id not in partidos:
            partidos[p_id] = {
                "id": f"cand-{p_id}",
                "name": "",
                "partyId": item['strOrganizacionPolitica'].split()[0].lower(), # Toma la primera palabra como 'renova' o 'verde'
                "runningFor": "Presidencia",
                "bio": f"Líder de {item['strOrganizacionPolitica']}. Candidato presidencial para las elecciones 2026.",
                "priorities": ["Seguridad", "Economía", "Salud"], # Valores base
                "experience": ["Consultar Hoja de Vida JNE"],
                "runningMate": "",
                "senators": [],
                "initials": ""
            }

        if cargo_id == 1:
            partidos[p_id]["name"] = nombre
            partidos[p_id]["initials"] = "".join([n[0] for n in item['strNombres'].split()[:1]] + [item['strApellidoPaterno'][0]]).upper()
        elif cargo_id == 2:
            partidos[p_id]["runningMate"] = nombre

    # 2. Procesar Senadores
    for item in raw_senadores:
        p_id = item['idOrganizacionPolitica']
        if p_id in partidos:
            nombre_sen = f"{item['strNombres']} {item['strApellidoPaterno']} {item['strApellidoMaterno']}".strip().title()
            partidos[p_id]["senators"].append({
                "name": nombre_sen,
                "region": item['strDepartamento'] if item['strDepartamento'] else "Nacional",
                "focus": ["Legislación", "Fiscalización"],
                "term": "2026-2031"
            })

    # 3. Convertir a formato TypeScript String
    candidates_list = list(partidos.values())
    
    # Solo tomamos los que tienen nombre de presidente (filtramos ruidos de la API)
    candidates_list = [c for c in candidates_list if c["name"] != ""]

    ts_output = "protected readonly candidates: Candidate[] = " + json.dumps(candidates_list, indent=4, ensure_ascii=False) + ";"
    
    # Guardar como archivo de texto/ts
    with open('candidates.ts', 'w', encoding='utf-8') as f:
        f.write(ts_output)

print("Estructura TypeScript generada en candidates.ts")

if __name__ == "__main__":
    generate_ts_structure()