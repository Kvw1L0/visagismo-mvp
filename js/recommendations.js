export const FACE_SHAPES = {
  ovalado: {
    name: 'Ovalado',
    tagline: 'Proporciones equilibradas y contornos suaves',
    description:
      'Considerado el rostro más armónico por sus proporciones equilibradas: la longitud es ligeramente mayor al ancho y la mandíbula es más estrecha que la frente con líneas redondeadas.',
    goal: 'Mantener el equilibrio natural sin alargar ni ensanchar en exceso.',
    recommendations: {
      cabello: {
        femenino: [
          'Corte Bob clásico o Long Bob (lob) a la altura de la clavícula.',
          'Capas largas con movimiento y ondas suaves.',
          'Flequillo cortina (curtain bangs) o raya al medio.',
        ],
        masculino: [
          'Pompadour clásico o Quiff texturizado.',
          'Undercut medio o Fade limpio con volumen moderado arriba.',
          'Cabello medio hacia atrás (slick back) o peinado natural.',
        ],
      },
      barba: [
        'Barba de 3 días o barba corta perfilada siguiendo la línea natural.',
        'Evitar barbas excesivamente largas que alarguen de más el mentón.',
      ],
      cejas: 'Arco suave y natural, evitando ángulos demasiado marcados o rectos.',
      maquillaje:
        'Contorno ligero debajo de los pómulos para realzar el relieve sin transformar la estructura.',
      gafas:
        'Prácticamente cualquier montura funciona; destacan las rectangulares suaves, ojo de gato (cat-eye) y aviador.',
      evitar: [
        'Flequillos muy pesados y rectos que oculten las proporciones.',
        'Volumen extremo en la coronilla que alargue demasiado el rostro.',
      ],
    },
  },

  redondo: {
    name: 'Redondo',
    tagline: 'Ancho y largo similares con mejillas llenas',
    description:
      'Presenta pómulos prominentes, líneas curvas suaves y una relación entre el largo y el ancho cercana a 1:1, con mandíbula redondeada.',
    goal: 'Estilizar, crear ángulos visuales y aportar verticalidad para alargar el rostro.',
    recommendations: {
      cabello: {
        femenino: [
          'Cortes por debajo de los hombros con capas largas que enmarquen el rostro.',
          'Raya lateral profunda para romper la simetría circular.',
          'Long Bob asimétrico (más largo adelante) con volumen en la coronilla.',
        ],
        masculino: [
          'Fade alto (high fade) o lados bien rebajados con volumen vertical arriba.',
          'Spiky, Quiff alto o Faux Hawk para alargar visualmente.',
          'Raya lateral marcada.',
        ],
      },
      barba: [
        'Barba más larga en el mentón (tipo perilla estilizada o candado angular) y corta en los laterales.',
        'Líneas rectas en las mejillas para definir ángulos.',
      ],
      cejas: 'Cejas con arco definido y ligeramente elevado para dar verticalidad a la mirada.',
      maquillaje:
        'Contouring en sienes, laterales de la mandíbula y debajo de los pómulos en diagonal ascendente.',
      gafas:
        'Monturas cuadradas, rectangulares o geométricas con ángulos marcados que contrasten con las curvas.',
      evitar: [
        'Cortes a la altura de la mandíbula con volumen lateral (tipo bob redondo).',
        'Flequillos rectos y tupidos.',
        'Gafas pequeñas o totalmente redondas.',
      ],
    },
  },

  cuadrado: {
    name: 'Cuadrado',
    tagline: 'Frente amplia y mandíbula fuerte y angular',
    description:
      'Se caracteriza por una línea de mandíbula recta y definida, frente ancha y un ancho similar entre frente, pómulos y mandíbula.',
    goal: 'Suavizar los ángulos rectos de la mandíbula y aportar fluidez y movimiento.',
    recommendations: {
      cabello: {
        femenino: [
          'Ondas suaves y capas desfiladas alrededor del rostro para suavizar la mandíbula.',
          'Flequillo desfilado o de lado que rompa la horizontalidad de la frente.',
          'Long Bob con puntas texturizadas por debajo del mentón.',
        ],
        masculino: [
          'Textured crop o cortes con textura natural arriba sin líneas excesivamente rígidas.',
          'Degradado medio (mid fade) manteniendo algo de largo en los parietales.',
          'Peinados con movimiento hacia un lado.',
        ],
      },
      barba: [
        'Barba redondeada en la zona del mentón y ligeramente más corta en las esquinas mandibulares.',
        'Barba de pocos días bien difuminada para no endurecer más el ángulo.',
      ],
      cejas: 'Cejas ligeramente curvadas o con arco suave; evitar cejas totalmente rectas.',
      maquillaje:
        'Difuminar contorno en las esquinas de la frente y en los ángulos externos de la mandíbula; iluminar el centro.',
      gafas:
        'Monturas redondeadas, ovaladas o estilo aviador que suavicen la geometría facial.',
      evitar: [
        'Cortes rectos (blunt cut) justo a la altura de la mandíbula.',
        'Raya al medio muy marcada con cabello lacio y pegado.',
        'Gafas muy cuadradas y de pasta gruesa.',
      ],
    },
  },

  alargado: {
    name: 'Alargado / Rectangular',
    tagline: 'Mayor longitud vertical que amplitud horizontal',
    description:
      'Rostro estilizado donde el largo supera notablemente al ancho, con frente, pómulos y mandíbula de proporciones similares.',
    goal: 'Aportar anchura visual en los laterales y acortar ópticamente la longitud vertical.',
    recommendations: {
      cabello: {
        femenino: [
          'Cortes a la altura de los hombros o mandíbula con volumen y ondas laterales.',
          'Flequillo recto, cortina o desfilado para acortar el tercio superior.',
          'Capas medias que den amplitud a la zona de los pómulos.',
        ],
        masculino: [
          'Cortes con largo medio en los laterales (scissor cut) y volumen moderado arriba.',
          'Flequillo texturizado hacia adelante (French crop) para reducir la altura de la frente.',
          'Peinados laterales con caída natural.',
        ],
      },
      barba: [
        'Barba completa de largo uniforme pero corta en el mentón y con mayor densidad en los laterales.',
        'Patillas bien definidas que aporten ancho visual.',
      ],
      cejas: 'Cejas más bien rectas u horizontales para generar sensación de amplitud.',
      maquillaje:
        'Aplicar rubor horizontalmente en los pómulos y contorno en la parte superior de la frente y punta del mentón.',
      gafas:
        'Monturas grandes (oversized), anchas, estilo Wayfarer o con puente bajo y detalles laterales.',
      evitar: [
        'Cabello muy largo, lacio y sin capas.',
        'Volumen alto en la coronilla (pompadours muy altos o tupés exagerados).',
        'Barbas largas en punta.',
      ],
    },
  },

  diamante: {
    name: 'Diamante',
    tagline: 'Pómulos altos y anchos, frente y mentón estrechos',
    description:
      'Los pómulos son la parte más ancha y protagonista del rostro, mientras que la frente y la línea mandibular son más estrechas y definidas.',
    goal: 'Suavizar el ancho de los pómulos y equilibrar dando amplitud visual a frente y mandíbula.',
    recommendations: {
      cabello: {
        femenino: [
          'Bob a la altura del mentón o lob con ondas que aporten volumen en la zona inferior.',
          'Flequillo lateral amplio o cortina abierta para ensanchar visualmente la frente.',
          'Evitar recoger todo el cabello tirante si se busca suavizar pómulos.',
        ],
        masculino: [
          'Cabello medio con textura y volumen en la zona frontal/lateral superior.',
          'Flequillo lateral o Quiff relajado que ensanche la frente.',
          'Evitar rapar demasiado los laterales si se tienen pómulos muy salientes.',
        ],
      },
      barba: [
        'Barba más llena en la zona de la mandíbula y mentón (cuadrada o redondeada) para dar peso al tercio inferior.',
      ],
      cejas: 'Arco suave y redondeado para suavizar la angularidad de los pómulos.',
      maquillaje:
        'Iluminar frente y mandíbula; aplicar contorno sutil en el punto más saliente de los pómulos.',
      gafas:
        'Monturas ovaladas, cat-eye o sin montura inferior (semi al aire) para equilibrar la parte superior.',
      evitar: [
        'Cortes con mucho volumen a la altura de las orejas/pómulos.',
        'Raya al medio muy pegada sin flequillo.',
      ],
    },
  },

  corazon: {
    name: 'Corazón / Triángulo Invertido',
    tagline: 'Frente amplia y mentón estrecho o en punta',
    description:
      'La parte superior (frente y pómulos) es más ancha que la inferior, afinándose progresivamente hacia un mentón delicado y estrecho.',
    goal: 'Equilibrar la amplitud de la frente aportando volumen y peso visual en el tercio inferior.',
    recommendations: {
      cabello: {
        femenino: [
          'Lob o media melena con puntas hacia afuera o volumen desde la mandíbula hacia abajo.',
          'Flequillo ligero o cortina que suavice el ancho de la frente.',
          'Capas que comiencen debajo de los pómulos.',
        ],
        masculino: [
          'Cortes de largo medio con caída natural y flequillo ligero sobre la frente.',
          'Textura moderada arriba, evitando demasiado volumen en los laterales superiores.',
        ],
      },
      barba: [
        'Barba completa o cuadrada en la zona inferior para ensanchar y dar estructura al mentón.',
        'Líneas suaves en las mejillas.',
      ],
      cejas: 'Cejas redondeadas y suaves, evitando arcos muy altos o angulosos.',
      maquillaje:
        'Contorno en las sienes y laterales de la frente; iluminar el mentón y los ángulos de la mandíbula.',
      gafas:
        'Monturas ligeras, redondas, aviador o más anchas en la base que en la parte superior.',
      evitar: [
        'Mucho volumen en la parte superior con puntas muy vacías abajo.',
        'Gafas muy gruesas y oscuras en la parte superior.',
      ],
    },
  },

  triangulo: {
    name: 'Triángulo / Pera',
    tagline: 'Mandíbula amplia y frente más estrecha',
    description:
      'El tercio inferior (mandíbula) es más ancho que los pómulos y la frente, creando una base sólida y dominante.',
    goal: 'Aportar volumen y amplitud en el tercio superior (frente y sienes) para equilibrar la mandíbula.',
    recommendations: {
      cabello: {
        femenino: [
          'Capas con volumen en la coronilla y zona de las sienes.',
          'Flequillo abundante hacia un lado o cortina abierta.',
          'Cortes medios o largos evitando terminar justo en la línea mandibular.',
        ],
        masculino: [
          'Volumen en la parte superior (Pompadour, Quiff, Brush up) con laterales limpios.',
          'Evitar cortes planos arriba que acentúen el ancho de la mandíbula.',
        ],
      },
      barba: [
        'Barba muy corta o afeitado limpio en los laterales de la mandíbula; si se usa barba, mantenerla perfilada y estilizada sin volumen lateral.',
      ],
      cejas: 'Cejas ligeramente alargadas hacia las sienes con un arco definido para ensanchar visualmente la parte superior.',
      maquillaje:
        'Iluminar frente y sienes; aplicar contorno en los ángulos laterales de la mandíbula.',
      gafas:
        'Monturas cat-eye, browline (Clubmaster) o con detalles marcados en la barra superior.',
      evitar: [
        'Cortes rectos a la altura de la mandíbula que sumen peso abajo.',
        'Raya al medio sin volumen superior.',
      ],
    },
  },
};

export const UNDERTONES = {
  calido: {
    name: 'Cálido (Dorado / Melocotón)',
    description:
      'Tu piel presenta matices dorados, amarillos o melocotón. Los tonos tierra y luminosos realzan tu rostro.',
    metals: 'Oro amarillo, bronce y cobre.',
    hairColors: 'Rubios dorados, miel, cobrizos, castaños chocolate y caramelo.',
    palette: ['#D4AF37', '#C86D51', '#8B4513', '#556B2F', '#E8B87D', '#FFF1D0'],
  },
  frio: {
    name: 'Frío (Rosado / Azulado)',
    description:
      'Tu piel presenta matices rosados, rojizos o azulados. Los colores puros, fríos y contrastados iluminan tus facciones.',
    metals: 'Plata, oro blanco y platino.',
    hairColors: 'Rubios ceniza o platino, castaños fríos, negro azulado y borgoña.',
    palette: ['#2B4C7E', '#7B2CBF', '#A4133C', '#2D6A4F', '#ADB5BD', '#F8F9FA'],
  },
  neutro: {
    name: 'Neutro (Equilibrado)',
    description:
      'Tienes un balance armónico entre matices cálidos y fríos, lo que te permite adaptarte con facilidad a ambas paletas.',
    metals: 'Oro rosa, plata y oro suave.',
    hairColors: 'Castaños naturales, bronde, avellana y tonos beige equilibrados.',
    palette: ['#B5838D', '#6D6875', '#457B9D', '#52796F', '#D4A373', '#EAE2B7'],
  },
};
