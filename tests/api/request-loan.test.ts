import { POST } from '@/app/api/request-loan/route'
import { prisma } from '@/app/lib/prisma'

// Mocks manuales de auth y admin
jest.mock('@/auth', () => ({
  auth: jest.fn(() => Promise.resolve({ user: { id: 'user-123' } })),
}))

const mockIsAdmin = false

jest.mock('@/lib/admin', () => ({
  admin: jest.fn(() => Promise.resolve(mockIsAdmin)),
}))


describe('POST /api/request-loan', () => {

  beforeAll(async () => {

    await prisma.user.create({
        data: {
            id: 'user-123', 
            name: 'Test User',
            email: 'test@example.com',
        },
    })

    await prisma.book.create({
      data: {
        id: 'book-001',
        title: 'Test Book',
        author: 'Test Author',
        available: true,
        pages: 100,
        publishedYear: 2020,
        language: 'es',
        genre: 'Ficción',
        description: 'Descripción',
        state: 'nuevo',
        imgUrl: 'https://example.com/test-book.jpg',
      },
    })
  })

    afterAll(async () => {
    await prisma.loan.deleteMany()
    await prisma.book.deleteMany()
    await prisma.user.deleteMany()
    await prisma.$disconnect()
    })

    it('>Endpoint-request: caso 1 - Crea un préstamo correctamente', async () => {

        const req = new Request('http://localhost/api/request-loan', {
                method: 'POST',
                body: JSON.stringify({ bookId: 'book-001' }),
                headers: {
                'Content-Type': 'application/json',
            },
        })

        const res = await POST(req)
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.loan).toHaveProperty('id')
    })

    it('>Endpoint-request: caso 2 - No se puede pedir un libro dos veces', async () => {
        await prisma.loan.create({
            data: {
            bookId: 'book-001',
            borrowerId: 'user-123',
            requestDate: new Date(),
            status: 'pending',
            },
        })

        const req = new Request('http://localhost/api/request-loan', {
            method: 'POST',
            body: JSON.stringify({ bookId: 'book-001' }),
            headers: { 'Content-Type': 'application/json' },
        })

        const res = await POST(req)
        const data = await res.json()

        expect(res.status).toBe(400)
        expect(data.success).toBe(false)
        expect(data.error).toMatch(/No puedes pedir un libro dos veces/i)
    })

    it('>Endpoint-request: caso 3 - Rechaza si el libro no está disponible', async () => {
        await prisma.book.update({
            where: { id: 'book-001' },
            data: { available: false }, 
        })
        
        const req = new Request('http://localhost/api/request-loan', {
            method: 'POST',
            body: JSON.stringify({ bookId: "book-001" }),
            headers: { 'Content-Type': 'application/json' }
        })

        const res = await POST(req)
        const data = await res.json()

        expect(res.status).toBe(400)
        expect(data.success).toBe(false)
        expect(data.error).toMatch(/El libro no está/i)
    })


})