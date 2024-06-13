import MessageLayout from "./MessageLayout"
export default function Layout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <section className=" h-full w-full">
       <MessageLayout />
      <div className=" h-5/6 lg:h-3/4 w-full ">
      {children}
      </div>
        </section>
  }