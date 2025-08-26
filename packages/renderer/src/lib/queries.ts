import { gql } from "@apollo/client";
export const GET_SET_INFO = gql`
  query SetEntrants($setId: ID!) {
    set(id: $setId) {
      id
      event {
        name
        tournament {
          name
        }
        videogame {
          id
          displayName
        }
      }
      slots {
        id
        entrant {
          id
          name
          participants {
            id
            prefix
            gamerTag
            user {
              genderPronoun
              authorizations(types: TWITTER) {
                externalUsername
              }
            }
            connectedAccounts
          }
        }
      }
    }
  }
`;

export const GET_ENTRANTS_INFO = gql`
  query EntrantsByVideogameInTournament(
    $tourneySlug: String
    $videogameId: [ID]
  ) {
    tournament(slug: $tourneySlug) {
      id
      name
      events(filter: { videogameId: $videogameId }) {
        id
        name
        entrants(query: { perPage: 70, page: 1 }) {
          nodes {
            id
            participants {
              id
              prefix
              gamerTag
              user {
                genderPronoun
                authorizations(types: TWITTER) {
                  externalUsername
                }
              }
            }
          }
        }
      }
    }
  }
`;
