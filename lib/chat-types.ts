export type ChatSourceKind = 'sermon' | 'event' | 'page' | 'vector'

export type ChatSource = {
  kind: ChatSourceKind
  title: string
  path: string
  snippet?: string
}
