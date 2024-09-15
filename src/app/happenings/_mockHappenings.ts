import { Content } from "@prismicio/client";

export const happenings: Content.HappeningDocument[] = [
    {
      id: "XYZ123",
      uid: "una-mirada-a-gerardo-mier",
      url: "/happenings/una-mirada-a-gerardo-mier",
      type: "happening",
      href: "https://your-repo.cdn.prismic.io/api/v2/documents/search?ref=XYZ&q=[[at(document.type,\"happening\")]]",
      tags: [],
      first_publication_date: "2023-01-01T00:00:00+0000",
      last_publication_date: "2023-01-01T00:00:00+0000",
      slugs: ["una-mirada-a-gerardo-mier"],
      linked_documents: [],
      lang: "es-es",
      alternate_languages: [],
      data: {
        slug: "una-mirada-a-gerardo-mier",
        category: "Arte",
        title: "Una mirada a Gerardo Mier",
        image: {
          id: "gerardo-mier-image",
          url: "https://festivalsantalucia.gob.mx/wp-content/uploads/grandes-eventos.png",
          alt: "Una mirada a Gerardo Mier",
          dimensions: { width: 1200, height: 800 },
          edit: { zoom: 1, x: 0, y: 0, background: "transparent" },
          copyright: null,
        },
        location_name: "Museo Marco",
        location_url: {
          link_type: "Web",
          url: "https://www.google.com"
        },
        description: [
          {
            type: "paragraph",
            text: "Disfruta de una experiencia única en el Museo MARCO con la nueva exposición de Gerardo Mier. Sumérgete en su mundo pictórico, donde la naturaleza y lo urbano se fusionan en obras de gran impacto visual. Una noche especial llena de arte, cultura y sorpresas. ¡No te lo pierdas!",
            spans: []
          },
          {
            type: "paragraph",
            text: "Juan Zuazua, Padre Raymundo Jardón y, Centro, 64000 Monterrey, N.L.",
            spans: [
              {
                start: 0,
                end: 70,
                type: "hyperlink",
                data: {
                  link_type: "Web",
                  url: "https://www.google.com/maps/place/Juan+Zuazua,+Padre+Raymundo+Jardn+y,+Centro,+64000+Monterrey,+N.L."
                }
              }
            ]
          },
          {
            type: "paragraph",
            text: "https://www.marco.org.mx/",
            spans: [
              {
                start: 0,
                end: 26,
                type: "hyperlink",
                data: {
                  link_type: "Web",
                  url: "https://www.marco.org.mx/"
                }
              }
            ]
          }
        ],
        date: "2024-09-04",
      },
    },
    {
      id: "ABC123",
      uid: "otro-evento",
      url: "/happenings/otro-evento",
      type: "happening",
      href: "https://your-repo.cdn.prismic.io/api/v2/documents/search?ref=ABC&q=[[at(document.type,\"happening\")]]",
      tags: [],
      first_publication_date: "2023-01-01T00:00:00+0000",
      last_publication_date: "2023-01-01T00:00:00+0000",
      slugs: ["otro-evento"],
      linked_documents: [],
      lang: "es-es",
      alternate_languages: [],
      data: {
        slug: "otro-evento",
        category: "Gastronomía",
        title: "Otro evento",
        image: {
          id: "otro-evento-image",
          url: "https://festivalsantalucia.gob.mx/wp-content/uploads/grandes-eventos.png",
          alt: "Otro evento",
          dimensions: { width: 1200, height: 800 },
          edit: { zoom: 1, x: 0, y: 0, background: "transparent" },
          copyright: null,
        },
        location_name: "Restaurante",
        location_url: {
          link_type: "Web",
          url: "https://www.google.com"
        },
        description: [
          {
            type: "paragraph",
            text: "Disfruta de una experiencia única en el Restaurante con el nuevo evento gastronómico. Sumérgete en un mundo de sabores, donde la naturaleza y lo urbano se fusionan en platos de gran impacto visual. Una noche especial llena de gastronomía, cultura y sorpresas. ¡No te lo pierdas!",
            spans: []
          },
          {
            type: "paragraph",
            text: "Dirección del restaurante",
            spans: [
              {
                start: 0,
                end: 70,
                type: "hyperlink",
                data: {
                  link_type: "Web",
                  url: "https://www.google.com/maps/place/Dirección+del+restaurante"
                }
              }
            ]
          },
          {
            type: "paragraph",
            text: "https://www.restaurante.com/",
            spans: [
              {
                start: 0,
                end: 26,
                type: "hyperlink",
                data: {
                  link_type: "Web",
                  url: "https://www.restaurante.com/"
                }
              }
            ]
          }
        ],
        date: "2024-09-04",
      },
    },
    {
      id: "DEF123",
      uid: "tercer-evento",
      url: "/happenings/tercer-evento",
      type: "happening",
      href: "https://your-repo.cdn.prismic.io/api/v2/documents/search?ref=DEF&q=[[at(document.type,\"happening\")]]",
      tags: [],
      first_publication_date: "2023-01-01T00:00:00+0000",
      last_publication_date: "2023-01-01T00:00:00+0000",
      slugs: ["tercer-evento"],
      linked_documents: [],
      lang: "es-es",
      alternate_languages: [],
      data: {
        slug: "tercer-evento",
        category: "Música",
        title: "Tercer evento",
        image: {
          id: "tercer-evento-image",
          url: "https://festivalsantalucia.gob.mx/wp-content/uploads/grandes-eventos.png",
          alt: "Tercer evento",
          dimensions: { width: 1200, height: 800 },
          edit: { zoom: 1, x: 0, y: 0, background: "transparent" },
          copyright: null,
        },
        location_name: "Teatro",
        location_url: {
          link_type: "Web",
          url: "https://www.google.com"
        },
        description: [
          {
            type: "paragraph",
            text: "Disfruta de una experiencia única en el Teatro con el nuevo evento musical. Sumérgete en un mundo de sonidos, donde la naturaleza y lo urbano se fusionan en melodías de gran impacto visual. Una noche especial llena de música, cultura y sorpresas. ¡No te lo pierdas!",
            spans: []
          },
          {
            type: "paragraph",
            text: "Dirección del teatro",
            spans: [
              {
                start: 0,
                end: 70,
                type: "hyperlink",
                data: {
                  link_type: "Web",
                  url: "https://www.google.com/maps/place/Dirección+del+teatro"
                }
              }
            ]
          },
          {
            type: "paragraph",
            text: "https://www.teatro.com/",
            spans: [
              {
                start: 0,
                end: 26,
                type: "hyperlink",
                data: {
                  link_type: "Web",
                  url: "https://www.teatro.com/"
                }
              }
            ]
          }
        ],
        date: "2024-09-04",
      },
    },
    {
      id: "GHI123",
      uid: "cuarto-evento",
      url: "/happenings/cuarto-evento",
      type: "happening",
      href: "https://your-repo.cdn.prismic.io/api/v2/documents/search?ref=GHI&q=[[at(document.type,\"happening\")]]",
      tags: [],
      first_publication_date: "2023-01-01T00:00:00+0000",
      last_publication_date: "2023-01-01T00:00:00+0000",
      slugs: ["cuarto-evento"],
      linked_documents: [],
      lang: "es-es",
      alternate_languages: [],
      data: {
        slug: "cuarto-evento",
        category: "Cultura",
        title: "Cuarto evento",
        image: {
          id: "cuarto-evento-image",
          url: "https://festivalsantalucia.gob.mx/wp-content/uploads/grandes-eventos.png",
          alt: "Cuarto evento",
          dimensions: { width: 1200, height: 800 },
          edit: { zoom: 1, x: 0, y: 0, background: "transparent" },
          copyright: null,
        },
        location_name: "Museo",
        location_url: {
          link_type: "Web",
          url: "https://www.google.com"
        },
        description: [
          {
            type: "paragraph",
            text: "Disfruta de una experiencia única en el Museo con el nuevo evento cultural. Sumérgete en un mundo de arte, donde la naturaleza y lo urbano se fusionan en obras de gran impacto visual. Una noche especial llena de cultura, sorpresas y diversión. ¡No te lo pierdas!",
            spans: []
          },
          {
            type: "paragraph",
            text: "Dirección del museo",
            spans: [
              {
                start: 0,
                end: 70,
                type: "hyperlink",
                data: {
                  link_type: "Web",
                  url: "https://www.google.com/maps/place/Dirección+del+museo"
                }
              }
            ]
          },
          {
            type: "paragraph",
            text: "https://www.museo.com/",
            spans: [
              {
                start: 0,
                end: 26,
                type: "hyperlink",
                data: {
                  link_type: "Web",
                  url: "https://www.museo.com/"
                }
              }
            ]
          }
        ],
        date: "2024-09-04",
      },
    },
    {
      id: "JKL123",
      uid: "quinto-evento",
      url: "/happenings/quinto-evento",
      type: "happening",
      href: "https://your-repo.cdn.prismic.io/api/v2/documents/search?ref=JKL&q=[[at(document.type,\"happening\")]]",
      tags: [],
      first_publication_date: "2023-01-01T00:00:00+0000",
      last_publication_date: "2023-01-01T00:00:00+0000",
      slugs: ["quinto-evento"],
      linked_documents: [],
      lang: "es-es",
      alternate_languages: [],
      data: {
        slug: "quinto-evento",
        category: "Cultura",
        title: "Quinto evento",
        image: {
          id: "quinto-evento-image",
          url: "https://festivalsantalucia.gob.mx/wp-content/uploads/grandes-eventos.png",
          alt: "Quinto evento",
          dimensions: { width: 1200, height: 800 },
          edit: { zoom: 1, x: 0, y: 0, background: "transparent" },
          copyright: null,
        },
        location_name: "Estadio",
        location_url: {
          link_type: "Web",
          url: "https://www.google.com"
        },
        description: [
          {
            type: "paragraph",
            text: "Disfruta de una experiencia única en el Estadio con el nuevo evento deportivo. Sumérgete en un mundo de competición, donde la naturaleza y lo urbano se fusionan en emocionantes partidos. Una noche especial llena de deporte, diversión y sorpresas. ¡No te lo pierdas!",
            spans: []
          },
          {
            type: "paragraph",
            text: "Dirección del estadio",
            spans: [
              {
                start: 0,
                end: 70,
                type: "hyperlink",
                data: {
                  link_type: "Web",
                  url: "https://www.google.com/maps/place/Dirección+del+estadio"
                }
              }
            ]
          },
          {
            type: "paragraph",
            text: "https://www.estadio.com/",
            spans: [
              {
                start: 0,
                end: 26,
                type: "hyperlink",
                data: {
                  link_type: "Web",
                  url: "https://www.estadio.com/"
                }
              }
            ]
          }
        ],
        date: "2024-09-04",
      },
    },
    {
      id: "MNO123",
      uid: "sexto-evento",
      url: "/happenings/sexto-evento",
      type: "happening",
      href: "https://your-repo.cdn.prismic.io/api/v2/documents/search?ref=MNO&q=[[at(document.type,\"happening\")]]",
      tags: [],
      first_publication_date: "2023-01-01T00:00:00+0000",
      last_publication_date: "2023-01-01T00:00:00+0000",
      slugs: ["sexto-evento"],
      linked_documents: [],
      lang: "es-es",
      alternate_languages: [],
      data: {
        slug: "sexto-evento",
        category: "Música",
        title: "Sexto evento",
        image: {
          id: "sexto-evento-image",
          url: "https://festivalsantalucia.gob.mx/wp-content/uploads/grandes-eventos.png",
          alt: "Sexto evento",
          dimensions: { width: 1200, height: 800 },
          edit: { zoom: 1, x: 0, y: 0, background: "transparent" },
          copyright: null,
        },
        location_name: "Centro de convenciones",
        location_url: {
          link_type: "Web",
          url: "https://www.google.com"
        },
        description: [
          {
            type: "paragraph",
            text: "Disfruta de una experiencia única en el Centro de Convenciones con el nuevo evento tecnológico. Sumérgete en un mundo de innovación, donde la naturaleza y lo urbano se fusionan en emocionantes conferencias. Una noche especial llena de tecnología, conocimiento y sorpresas. ¡No te lo pierdas!",
            spans: []
          },
          {
            type: "paragraph",
            text: "Dirección del centro de convenciones",
            spans: [
              {
                start: 0,
                end: 70,
                type: "hyperlink",
                data: {
                  link_type: "Web",
                  url: "https://www.google.com/maps/place/Dirección+del+centro+de+convenciones"
                }
              }
            ]
          },
          {
            type: "paragraph",
            text: "https://www.centrodeconvenciones.com/",
            spans: [
              {
                start: 0,
                end: 26,
                type: "hyperlink",
                data: {
                  link_type: "Web",
                  url: "https://www.centrodeconvenciones.com/"
                }
              }
            ]
          }
        ],
        date: "2024-09-04",
      },
    }
  ];