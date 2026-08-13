import { type NextRequest, NextResponse } from 'next/server'
import { createR2DownloadUrl, isR2Configured } from '@/lib/r2'
import { MEDIA_PREFIX } from '@/lib/media-kinds'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Params = { key: string[] }

/**
 * GET /api/media/<folder>/<file>
 * يعمل redirect لرابط R2 موقّع — الـ bucket يفضل private ومحدش يوصله مباشرة.
 */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<Params> },
): Promise<NextResponse> {
  const { key } = await context.params
  const objectKey = `${MEDIA_PREFIX}${key.join('/')}`

  if (key.length === 0 || objectKey.includes('..')) {
    return NextResponse.json({ error: 'المسار غير صحيح' }, { status: 400 })
  }

  if (!isR2Configured()) {
    return NextResponse.json({ error: 'التخزين السحابي غير مهيّأ' }, { status: 503 })
  }

  try {
    // نوقّع الرابط لمدة ساعة، ونخلي المتصفح يكاش الـ redirect أقل من كده
    const signedUrl = await createR2DownloadUrl(objectKey, 3600)
    const res = NextResponse.redirect(signedUrl, 302)
    res.headers.set('Cache-Control', 'private, max-age=1800')
    return res
  } catch (error) {
    console.error('[media] download error:', error)
    return NextResponse.json({ error: 'تعذّر جلب الملف' }, { status: 500 })
  }
}
