import SearchLayout from "./SearchLayout"
export default function Layout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <section>
       <SearchLayout />
        {children}
        </section>
  }