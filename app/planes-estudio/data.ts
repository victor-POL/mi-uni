export interface MateriaPlanEstudio {
  idMateria: number
  codigoMateria: string
  nombreMateria: string
  anioCursada: number
  cuatrimestreCursada: number
  listaCorrelativas: number[]
  horasSemanales?: number
}

export interface PlanDeEstudio {
  idPlan: number
  nombreCarrera: string
  anio: number
  materias: MateriaPlanEstudio[]
}


// Datos de ejemplo
export const planesDeEstudio: PlanDeEstudio[] = [
  {
    idPlan: 1,
    nombreCarrera: "Ingeniería en Sistemas",
    anio: 2023,
    materias: [
  {
    "idMateria": 26,
    "codigoMateria": "00901",
    "nombreMateria": "INGLES NIVEL I",
    "anioCursada": 1,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [],
    "horasSemanales": 4
  },
  {
    "idMateria": 43,
    "codigoMateria": "00902",
    "nombreMateria": "INGLES NIVEL II",
    "anioCursada": 2,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      26
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 81,
    "codigoMateria": "00903",
    "nombreMateria": "INGLES NIVEL III",
    "anioCursada": 2,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      43
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 82,
    "codigoMateria": "00904",
    "nombreMateria": "INGLES NIVEL IV",
    "anioCursada": 3,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      81
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 34,
    "codigoMateria": "00911",
    "nombreMateria": "COMPUTACION NIVEL I",
    "anioCursada": 1,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [],
    "horasSemanales": 4
  },
  {
    "idMateria": 83,
    "codigoMateria": "00912",
    "nombreMateria": "COMPUTACION  NIVEL II",
    "anioCursada": 2,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      34
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4950,
    "codigoMateria": "03621",
    "nombreMateria": "MATEMATICA DISCRETA",
    "anioCursada": 1,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [],
    "horasSemanales": 4
  },
  {
    "idMateria": 4951,
    "codigoMateria": "03622",
    "nombreMateria": "ANALISIS MATEMATICO I",
    "anioCursada": 1,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [],
    "horasSemanales": 4
  },
  {
    "idMateria": 4952,
    "codigoMateria": "03623",
    "nombreMateria": "PROGRAMACION INICIAL",
    "anioCursada": 1,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [],
    "horasSemanales": 4
  },
  {
    "idMateria": 4953,
    "codigoMateria": "03624",
    "nombreMateria": "INTRODUCCION A LOS SISTEMAS DE INFORMACION",
    "anioCursada": 1,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [],
    "horasSemanales": 4
  },
  {
    "idMateria": 4954,
    "codigoMateria": "03625",
    "nombreMateria": "SISTEMAS DE NUMERACION",
    "anioCursada": 1,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [],
    "horasSemanales": 4
  },
  {
    "idMateria": 4955,
    "codigoMateria": "03626",
    "nombreMateria": "PRINCIPIOS DE CALIDAD DE SOFTWARE",
    "anioCursada": 1,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [],
    "horasSemanales": 4
  },
  {
    "idMateria": 4956,
    "codigoMateria": "03627",
    "nombreMateria": "ALGEBRA Y GEOMETRIA ANALITICA I",
    "anioCursada": 1,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [],
    "horasSemanales": 4
  },
  {
    "idMateria": 4957,
    "codigoMateria": "03628",
    "nombreMateria": "FISICA I",
    "anioCursada": 1,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      4951
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4958,
    "codigoMateria": "03629",
    "nombreMateria": "PROGRAMACION ESTRUCTURADA BASICA",
    "anioCursada": 1,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      4952
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4959,
    "codigoMateria": "03630",
    "nombreMateria": "INTRODUCCION A LA GESTION DE REQUISITOS",
    "anioCursada": 1,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      4953
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4960,
    "codigoMateria": "03631",
    "nombreMateria": "FUNDAMENTOS DE SISTEMAS EMBEBIDOS",
    "anioCursada": 1,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      4954
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4961,
    "codigoMateria": "03632",
    "nombreMateria": "INTRODUCCION A LOS PROYECTOS INFORMATICOS",
    "anioCursada": 1,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [],
    "horasSemanales": 4
  },
  {
    "idMateria": 4962,
    "codigoMateria": "03633",
    "nombreMateria": "ANALISIS MATEMATICO II",
    "anioCursada": 2,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4951
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4963,
    "codigoMateria": "03634",
    "nombreMateria": "FISICA II",
    "anioCursada": 2,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4957
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4964,
    "codigoMateria": "03635",
    "nombreMateria": "TOPICOS DE PROGRAMACION",
    "anioCursada": 2,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4950,
      4958
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4965,
    "codigoMateria": "03636",
    "nombreMateria": "BASES DE DATOS",
    "anioCursada": 2,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4950,
      4958
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4966,
    "codigoMateria": "03637",
    "nombreMateria": "ANALISIS DE SISTEMAS",
    "anioCursada": 2,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4959
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4967,
    "codigoMateria": "03638",
    "nombreMateria": "ARQUITECTURA DE COMPUTADORAS",
    "anioCursada": 2,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4960
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4968,
    "codigoMateria": "03639",
    "nombreMateria": "ANALISIS MATEMATICO III",
    "anioCursada": 2,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      4962
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4969,
    "codigoMateria": "03640",
    "nombreMateria": "ALGORITMOS Y ESTRUCTURAS DE DATOS",
    "anioCursada": 2,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      4964
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4970,
    "codigoMateria": "03641",
    "nombreMateria": "BASES DE DATOS APLICADAS",
    "anioCursada": 2,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      4965
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4971,
    "codigoMateria": "03642",
    "nombreMateria": "PRINCIPIOS DE DISEÑO DE SISTEMAS",
    "anioCursada": 2,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      4955,
      4966
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4972,
    "codigoMateria": "03643",
    "nombreMateria": "REDES DE COMPUTADORAS",
    "anioCursada": 2,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      4963,
      4967
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4973,
    "codigoMateria": "03644",
    "nombreMateria": "GESTION DE LAS ORGANIZACIONES",
    "anioCursada": 2,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      4961
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4974,
    "codigoMateria": "03645",
    "nombreMateria": "ALGEBRA Y GEOMETRIA ANALITICA II",
    "anioCursada": 3,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4956
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4975,
    "codigoMateria": "03646",
    "nombreMateria": "PARADIGMAS DE PROGRAMACION",
    "anioCursada": 3,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4962,
      4969
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4976,
    "codigoMateria": "03647",
    "nombreMateria": "REQUISITOS AVANZADOS",
    "anioCursada": 3,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4971
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4977,
    "codigoMateria": "03648",
    "nombreMateria": "DISEÑO DE SOFTWARE",
    "anioCursada": 3,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4965,
      4971
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4978,
    "codigoMateria": "03649",
    "nombreMateria": "SISTEMAS OPERATIVOS",
    "anioCursada": 3,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4967
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4979,
    "codigoMateria": "03650",
    "nombreMateria": "SEGURIDAD DE LA INFORMACION",
    "anioCursada": 3,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4964,
      4967,
      4972
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4980,
    "codigoMateria": "03651",
    "nombreMateria": "PROBABILIDAD Y ESTADISTICA",
    "anioCursada": 3,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      4950,
      4968,
      4974
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4981,
    "codigoMateria": "03652",
    "nombreMateria": "PROGRAMACION AVANZADA",
    "anioCursada": 3,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      4975,
      4970
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4982,
    "codigoMateria": "03653",
    "nombreMateria": "ARQUITECTURA DE SISTEMAS SOFTWARE",
    "anioCursada": 3,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      4977
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4983,
    "codigoMateria": "03654",
    "nombreMateria": "VIRTUALIZACION DE HARDWARE",
    "anioCursada": 3,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      4969,
      4974,
      4978
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4984,
    "codigoMateria": "03655",
    "nombreMateria": "AUDITORIA Y LEGISLACION",
    "anioCursada": 3,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      4979
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4985,
    "codigoMateria": "03656",
    "nombreMateria": "ESTADISTICA APLICADA",
    "anioCursada": 4,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4970,
      4980
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4986,
    "codigoMateria": "03657",
    "nombreMateria": "AUTOMATAS Y GRAMATICAS",
    "anioCursada": 4,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4975
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4987,
    "codigoMateria": "03658",
    "nombreMateria": "PROGRAMACION CONCURRENTE",
    "anioCursada": 4,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4975,
      4983
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4988,
    "codigoMateria": "03659",
    "nombreMateria": "GESTION APLICADA AL DESARROLLO DE SOFTWARE I",
    "anioCursada": 4,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4973,
      4976,
      4982
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4989,
    "codigoMateria": "03660",
    "nombreMateria": "SISTEMAS OPERATIVOS AVANZADOS",
    "anioCursada": 4,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4983
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4990,
    "codigoMateria": "03661",
    "nombreMateria": "GESTION DE PROYECTOS",
    "anioCursada": 4,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4973,
      4979,
      4980
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4991,
    "codigoMateria": "03662",
    "nombreMateria": "MATEMATICA APLICADA",
    "anioCursada": 4,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      4980
    ],
    "horasSemanales": 6
  },
  {
    "idMateria": 4992,
    "codigoMateria": "03663",
    "nombreMateria": "LENGUAJES Y COMPILADORES",
    "anioCursada": 4,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      4986
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4993,
    "codigoMateria": "03664",
    "nombreMateria": "INTELIGENCIA ARTIFICIAL",
    "anioCursada": 4,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      4975,
      4980
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4994,
    "codigoMateria": "03665",
    "nombreMateria": "GESTION APLICADA AL DESARROLLO DE SOFTWARE II",
    "anioCursada": 4,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      4981,
      4988
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4995,
    "codigoMateria": "03666",
    "nombreMateria": "SEGURIDAD APLICADA Y FORENSIA",
    "anioCursada": 4,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      4978,
      4981,
      4984
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4996,
    "codigoMateria": "03667",
    "nombreMateria": "GESTION DE LA CALIDAD EN PROCESOS DE SISTEMAS",
    "anioCursada": 4,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": [
      4976
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4997,
    "codigoMateria": "03668",
    "nombreMateria": "INTELIGENCIA ARTIFICIAL APLICADA",
    "anioCursada": 5,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4985,
      4993
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4998,
    "codigoMateria": "03669",
    "nombreMateria": "INNOVACION Y EMPRENDEDORISMO",
    "anioCursada": 5,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4990
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 4999,
    "codigoMateria": "03670",
    "nombreMateria": "CIENCIA DE DATOS",
    "anioCursada": 5,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4985,
      4993
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 5000,
    "codigoMateria": "03671",
    "nombreMateria": "PROYECTO FINAL DE CARRERA",
    "anioCursada": 5,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4985,
      4988,
      4989,
      4990,
      4996
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 5003,
    "codigoMateria": "03675",
    "nombreMateria": "PRACTICA PROFESIONAL SUPERVISADA",
    "anioCursada": 3,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4971
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 5004,
    "codigoMateria": "03676",
    "nombreMateria": "RESPONSABILIDAD SOCIAL UNIVERSITARIA",
    "anioCursada": 2,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": [
      4955
    ],
    "horasSemanales": 4
  },
  {
    "idMateria": 5010,
    "codigoMateria": "03672",
    "nombreMateria": "ELECTIVA I",
    "anioCursada": 5,
    "cuatrimestreCursada": 1,
    "listaCorrelativas": []
  },
  {
    "idMateria": 5011,
    "codigoMateria": "03673",
    "nombreMateria": "ELECTIVA II",
    "anioCursada": 5,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": []
  },
  {
    "idMateria": 5012,
    "codigoMateria": "03674",
    "nombreMateria": "ELECTIVA III",
    "anioCursada": 5,
    "cuatrimestreCursada": 2,
    "listaCorrelativas": []
  }
]
  }
]