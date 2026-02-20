import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { News } from './collections/News'
import { Pages } from './collections/Pages'
import { Stores } from './collections/Stores'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const connectionString =
  process.env.PAYLOAD_DATABASE_URI || process.env.SUPABASE_DB_URL || process.env.DATABASE_URL || ''
const disableTlsVerification =
  process.env.PAYLOAD_DB_SSL_NO_VERIFY === 'true' ||
  connectionString.includes('sslmode=no-verify') ||
  connectionString.includes('uselibpqcompat=true')

export default buildConfig({
  cors: ['http://localhost:8081', process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'].filter(Boolean),
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Products, News, Pages, Stores],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    idType: 'uuid',
    push: false,
    pool: {
      connectionString,
      ssl: disableTlsVerification ? { rejectUnauthorized: false } : undefined,
    },
  }),
  sharp,
  plugins: [],
})
