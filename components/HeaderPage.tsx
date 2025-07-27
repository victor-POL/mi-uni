interface HeaderPageProps {
  readonly title: string
  readonly description: string
}

export const HeaderPage = ({ title, description }: HeaderPageProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}
