import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import type { Tecnico } from '../../types'

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
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0',
    padding: 8,
  },
  tableCol: {
    width: '25%',
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

interface TechniciansReportProps {
  technicians: Tecnico[]
  title: string
}

const TechniciansReportDocument: React.FC<TechniciansReportProps> = ({ technicians, title }) => {
  const getCargoCounts = () => {
    const counts = technicians.reduce((acc, tech) => {
      acc[tech.cargo] = (acc[tech.cargo] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return counts
  }

  const cargoCounts = getCargoCounts()

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{title}</Text>
        <Text style={styles.subHeader}>
          Gerado em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>ID</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Nome</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Email</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Cargo</Text>
            </View>
          </View>

          {technicians.map((tech) => (
            <View style={styles.tableRow} key={tech.id}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{tech.id}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{tech.nome}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{tech.email}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{tech.cargo}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Resumo do Relatório</Text>
          <View style={styles.summaryItem}>
            <Text>Total de Técnicos:</Text>
            <Text>{technicians.length}</Text>
          </View>
          {Object.entries(cargoCounts).map(([cargo, count]) => (
            <View style={styles.summaryItem} key={cargo}>
              <Text>Cargo "{cargo}":</Text>
              <Text>{count}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Sistema de Ordem de Serviço - Relatório de Técnicos
        </Text>
      </Page>
    </Document>
  )
}

export const generateTechniciansReport = async (technicians: Tecnico[], title: string) => {
  const doc = <TechniciansReportDocument technicians={technicians} title={title} />
  const asPdf = pdf(doc)
  const blob = await asPdf.toBlob()
  
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `relatorio-tecnicos-${new Date().toISOString().split('T')[0]}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default TechniciansReportDocument