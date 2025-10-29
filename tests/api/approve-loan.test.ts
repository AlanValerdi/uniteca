import { PATCH } from '@/app/api/approve-loan/route'
import { prisma } from '@/app/lib/prisma'

// Mock de auth
jest.mock('@/auth', () => ({
  auth: jest.fn(),
}))
// Mock de getAdmin
jest.mock('@/app/actions/getAdmin', () => ({
  __esModule: true,
  default: jest.fn(),
}))

import { auth } from '@/auth'
import getAdmin from '@/app/actions/getAdmin'

describe('PATCH /api/approve-loan', () => {
  let loanId: string

  beforeAll(async () => {
    await prisma.user.create({
      data: {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@example.com',
      },
    })

    await prisma.book.create({
      data: {
        id: 'book-123',
        title: 'Libro Test',
        author: 'Autor',
        available: true,
        pages: 100,
        publishedYear: 2021,
        language: 'es',
        genre: 'Ficción',
        description: 'desc',
        state: 'nuevo',
        imgUrl: 'http://img.com/libro.jpg',
      },
    })

    const loan = await prisma.loan.create({
      data: {
        bookId: 'book-123',
        borrowerId: 'admin-1',
        requestDate: new Date(),
        status: 'pending',
      },
    })

    loanId = loan.id
  })

  afterAll(async () => {
    await prisma.loan.deleteMany()
    await prisma.book.deleteMany()
    await prisma.user.deleteMany()
    await prisma.$disconnect()
  })

  it('>Endpoint-approve: caso 1 - Admin aprueba un préstamo correctamente', async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: 'admin-1' } })
    ;(getAdmin as jest.Mock).mockResolvedValue({ role: 'admin' })

    const req = new Request(`http://localhost/api/approve-loan?loanId=${loanId}`, {
      method: 'PATCH',
    })

    const res = await PATCH(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)

    const updatedLoan = await prisma.loan.findUnique({ where: { id: loanId } })
    expect(updatedLoan?.status).toBe('approved')
    expect(updatedLoan?.dueDate).toBeDefined()
  })

  it('>Endpoint-approve: caso 2 - Falla si no hay sesión', async () => {
    (auth as jest.Mock).mockResolvedValue(null)
    ;(getAdmin as jest.Mock).mockResolvedValue(null)

    const req = new Request(`http://localhost/api/approve-loan?loanId=${loanId}`, {
      method: 'PATCH',
    })

    const res = await PATCH(req)
    const data = await res.json()

    expect(res.status).toBe(401)
    expect(data.error).toMatch(/Unauthorized/)
  })

  it('>Endpoint-approve: caso 3 - Falla si el usuario no es admin', async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: 'admin-1' } })
    ;(getAdmin as jest.Mock).mockResolvedValue({ role: 'user' })

    const req = new Request(`http://localhost/api/approve-loan?loanId=${loanId}`, {
      method: 'PATCH',
    })

    const res = await PATCH(req)
    const data = await res.json()

    expect(res.status).toBe(401)
    expect(data.error).toMatch(/Unauthorized/)
  })

  it('>Endpoint-approve: caso 4 - Falla si no se provee loanId', async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: 'admin-1' } })
    ;(getAdmin as jest.Mock).mockResolvedValue({ role: 'admin' })

    const req = new Request(`http://localhost/api/approve-loan`, {
      method: 'PATCH',
    })

    const res = await PATCH(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toMatch(/Missing loanId/)
  })
})
