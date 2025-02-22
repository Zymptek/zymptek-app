export const homePageQuery = `{
  "hero": *[_type == "homepage"][0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title {
      gradient,
      main
    },
    description,
    searchPlaceholder,
    stats {
      products {
        number,
        label
      },
      suppliers {
        number,
        label
      },
      countries {
        number,
        label
      }
    },
    animation {
      url
    }
  },
  "categories": *[_type == "categorySection"][0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title {
      start,
      highlight
    },
    description,
    search {
      placeholder,
      noResults,
      clearButton
    },
    navigation {
      previous,
      next
    }
  }
}`; 