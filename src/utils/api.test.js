import apiFunc from './api'

jest.mock('axios')

describe('api util', () => {
  it('called without arguments', async () => {
    const response = await apiFunc()

    expect(response).toBeTruthy()
  })
  it('called with arguments', async () => {
    const response = await apiFunc({ path: 'transfer' })

    expect(response).toBeTruthy()
  })
})
