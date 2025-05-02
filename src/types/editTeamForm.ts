export type EditTeamFormType = {
  name: string
  logo: File | null
  slug: string
  city: string
  arena: string
  colors: {
    primary: string | null
    secondary: string | null
  }
}
