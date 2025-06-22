import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import type { OSWithDetails } from '../../types'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    color: '#666666',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0',
    padding: 8,
  },
  tableCol: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 8,
  },
  tableCellHeader: {
    margin: 'auto',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableCell: {
    margin: 'auto',
    fontSize: 9,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666666',
  },
  summary: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryItem: {
    fontSize: 10,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

interface OrdersReportProps {
  orders: OSWithDetails[]
  title: string
  dateRange?: string
}

const OrdersReportDocument: React.FC<OrdersReportProps> = ({ orders, title, dateRange }) => {
  const getStatusCounts = () => {
    const counts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return counts
  }

  const statusCounts = getStatusCounts()

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{title}</Text>
        {dateRange && (
          <Text style={styles.subHeader}>Período: {dateRange}</Text>
        )}
        <Text style={styles.subHeader}>
          Gerado em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>ID</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Cliente</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Status</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Data Abertura</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Descrição</Text>
            </View>
          </View>

          {orders.map((order) => (
            <View style={styles.tableRow} key={order.id}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{order.id}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{order.clienteNome || 'N/A'}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{order.status}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {new Date(order.dataAbertura).toLocaleDateString('pt-BR')}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {order.descricaoProblema.length > 30
                    ? `${order.descricaoProblema.substring(0, 30)}...`
                    : order.descricaoProblema}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Resumo do Relatório</Text>
          <View style={styles.summaryItem}>
            <Text>Total de Ordens de Serviço:</Text>
            <Text>{orders.length}</Text>
          </View>
          {Object.entries(statusCounts).map(([status, count]) => (
            <View style={styles.summaryItem} key={status}>
              <Text>Status "{status}":</Text>
              <Text>{count}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Sistema de Ordem de Serviço - Relatório gerado automaticamente
        </Text>
      </Page>
    </Document>
  )
}

export const generateOrdersReport = async (orders: OSWithDetails[], title: string, dateRange?: string) => {
  const doc = <OrdersReportDocument orders={orders} title={title} dateRange={dateRange} />
  const asPdf = pdf(doc)
  const blob = await asPdf.toBlob()
  
  // Create download link
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `relatorio-os-${new Date().toISOString().split('T')[0]}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default OrdersReportDocument