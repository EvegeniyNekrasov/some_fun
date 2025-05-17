import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/projects/$projectId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/projects/$projectId"!</div>
}
