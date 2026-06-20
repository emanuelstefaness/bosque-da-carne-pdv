import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getApiBase } from '../devApiBase'
import PedidoOnlineAcompanhamento, { lerPedidoLocal } from '../components/PedidoOnlineAcompanhamento'

const API = getApiBase()

export default function PedirOnlineAcompanhar() {
  const { orderId: orderIdParam } = useParams()
  const navigate = useNavigate()
  const apiBase = API || (typeof window !== 'undefined' ? window.location.origin : '')

  const pedidoLocal = useMemo(() => lerPedidoLocal(), [])
  const idFromUrl = orderIdParam ? Number(orderIdParam) : null
  const telFromLocal = idFromUrl && pedidoLocal?.id === idFromUrl ? pedidoLocal.telefone : ''

  const [formId, setFormId] = useState(orderIdParam || '')
  const [formTel, setFormTel] = useState(telFromLocal || '')
  const [consulta, setConsulta] = useState(() => {
    if (idFromUrl && telFromLocal) return { id: idFromUrl, telefone: telFromLocal }
    return null
  })

  const handleBuscar = (e) => {
    e.preventDefault()
    const id = Number(String(formId).trim())
    if (!Number.isFinite(id) || id < 1) return
    const tel = formTel.trim()
    if (!tel) return
    setConsulta({ id, telefone: tel })
    navigate(`/acompanhar/${id}`, { replace: true })
  }

  if (consulta?.id) {
    return (
      <PedidoOnlineAcompanhamento
        orderId={consulta.id}
        apiBase={apiBase}
        telefoneConsulta={consulta.telefone}
        onNovoPedido={() => navigate('/pedir')}
      />
    )
  }

  return (
    <div className="menu-bg flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <h1 className="text-center text-2xl font-bold text-slate-900">Acompanhar pedido</h1>
        <p className="mt-2 text-center text-sm text-slate-600">
          Informe o número do pedido e seu telefone para ver o andamento em tempo real.
        </p>
        <form onSubmit={handleBuscar} className="mt-6 space-y-3">
          <input
            type="number"
            min="1"
            required
            placeholder="Número do pedido *"
            value={formId}
            onChange={(e) => setFormId(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
          <input
            type="tel"
            required
            placeholder="Telefone (WhatsApp) *"
            value={formTel}
            onChange={(e) => setFormTel(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
          <button type="submit" className="w-full rounded-xl bg-black py-3 font-semibold text-white">
            Ver andamento
          </button>
        </form>
        <Link to="/pedir" className="mt-4 block text-center text-sm text-slate-600 hover:underline">
          Voltar ao cardápio
        </Link>
      </div>
    </div>
  )
}
