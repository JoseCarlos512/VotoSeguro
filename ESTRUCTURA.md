
# ENDPOINTS ·


## Servicios Externo
### (GET) https://web.jne.gob.pe/serviciovotoinformado/api/votoinf/listarCanditatos
idTipoEleccion = 1 : Obtenemos lista de candidatos presidenciales y vicepresidentes por partido politico
idTipoEleccion = 20: Obtenemos lista de senadores por partido politico
```json
Request: {

        "idProcesoElectoral": 124,
        "idTipoEleccion": 1,
        "strUbiDepartamento": ""
}
Response: {
    "data": [
        {
            "strCodExpedienteExt": "EG.2026017341",
            "idProcesoElectoral": 124,
            "strProcesoElectoral": "ELECCIONES GENERALES 2026",
            "idTipoEleccion": 1,
            "strTipoEleccion": "PRESIDENCIAL",
            "strAmbito": "NACIONAL",
            "strAnio_Eleccion": "2026",
            "strUbigeo": "000000",
            "strDepartamento": "ANCASH",
            "strProvincia": "",
            "strDistrito": "",
            "idTipoOrgPolitica": 1,
            "strTipoOrgPolitica": "PARTIDOS POLITICOS",
            "idOrganizacionPolitica": 2898,
            "strOrganizacionPolitica": "FE EN EL PERU",
            "idJuradoElectoralCreacion": 2039,
            "strJuradoElectoralCreacion": "LIMA CENTRO 1",
            "intPosicion": 2,
            "idCargo": 2,
            "strCargo": "PRIMER VICEPRESIDENTE DE LA REPÚBLICA",
            "strTipoDocumento": "DNI",
            "strDocumentoIdentidad": "40713950",
            "strNombres": "YESSIKA ROXSANA",
            "strApellidoPaterno": "ARTEAGA",
            "strApellidoMaterno": "NARVAEZ",
            "strSexo": "FEMENINO",
            "strFechaNacimiento": "5/10/1980 00:00:00",
            "strEsNativo": "NO",
            "strEstadoCandidato": "INSCRITO",
            "strGuidFoto": "954924da-df44-4c51-84ee-1fe30cb93445",
            "strNombre": "954924da-df44-4c51-84ee-1fe30cb93445.jpg",
            "strUrlOrganizacionPolitica": ""
        },
        {},
    ]
}
```
----

## Servicios Internos
### GET Jne/Candidatos


```json
Request: {

        "idProcesoElectoral": 124,
        "idTipoEleccion": 1,
        "strUbiDepartamento": ""
}
Response: {
    [
        {
        id: 'cand-4',
        name: 'Ricardo Almeida',
        partyId: 'futuro',
        runningFor: 'Presidencia',
        bio: 'Empresario tecnologico, enfocado en inversion privada, talento digital y regulacion simple.',
        priorities: ['Inversion productiva', 'Talento digital', 'Reforma regulatoria'],
        experience: ['CEO de startup regional', 'Presidente de gremio empresarial', 'Mentor de emprendimientos'],
        runningMate: 'Camila Soto',
        senators: [
            {
            name: 'Carolina Lujan',
            region: 'Metropolitana',
            focus: ['Innovacion publica', 'Datos abiertos'],
            term: '2020-2026',
            },
            {
            name: 'Bruno Medina',
            region: 'Norte Chico',
            focus: ['Infraestructura logistica', 'Competitividad'],
            term: '2018-2026',
            },
        ],
        vicepresidentes: [
            {
            name: 'Carolina Lujan',
            region: 'Metropolitana',
            focus: ['Innovacion publica', 'Datos abiertos'],
            term: '2020-2026',
            },
            {
            name: 'Carolina Lujan',
            region: 'Metropolitana',
            focus: ['Innovacion publica', 'Datos abiertos'],
            term: '2020-2026',
            }
        ]
        initials: 'RA',
        },
    ]
};
```
----