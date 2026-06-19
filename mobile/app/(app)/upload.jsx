import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as DocumentPicker from 'expo-document-picker'
import { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Button, HelperText, Text } from 'react-native-paper'
import { useAppTheme } from '../../src/context/ThemeContext'
import { importLeadsFromExcel } from '../../src/services/leadStorage'
import { fontSize } from '../../src/theme/typography'
import { EXPECTED_EXCEL_COLUMNS } from '../../src/utils/excelImport'

const EXCEL_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
]

function formatFileSize(bytes) {
  if (!bytes) return 'Unknown size'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function UploadScreen() {
  const { colors } = useAppTheme()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const pickFile = async () => {
    setError('')
    setSuccess('')

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: EXCEL_TYPES,
        copyToCacheDirectory: true,
        multiple: false,
      })

      if (result.canceled) {
        return
      }

      const selected = result.assets[0]

      if (!selected.name.match(/\.(xlsx|xls)$/i)) {
        setError('Please select a valid Excel file (.xlsx or .xls).')
        return
      }

      setFile(selected)
    } catch {
      setError('Could not pick file. Please try again.')
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an Excel file first.')
      return
    }

    setError('')
    setSuccess('')
    setUploading(true)

    try {
      const result = await importLeadsFromExcel(file)
      setSuccess(`Imported ${result.count} lead${result.count === 1 ? '' : 's'} from "${file.name}".`)
      setFile(null)
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const clearFile = () => {
    setFile(null)
    setError('')
    setSuccess('')
  }

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.infoCard, { backgroundColor: colors.successSoft }]}>
        <MaterialCommunityIcons name="file-excel-outline" size={40} color={colors.success} />
        <Text style={[styles.infoTitle, { color: colors.text }]}>Upload Excel File</Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          Import leads from an Excel spreadsheet. Supported formats: .xlsx, .xls
        </Text>
        <Text style={[styles.columnsText, { color: colors.text }]}>
          Expected columns: {EXPECTED_EXCEL_COLUMNS}
        </Text>
      </View>

      <View style={[styles.uploadCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <View
          style={[
            styles.dropZone,
            { borderColor: colors.borderStrong, backgroundColor: colors.dropZoneBg },
          ]}
        >
          <MaterialCommunityIcons name="cloud-upload-outline" size={48} color={colors.primary} />
          <Text style={[styles.dropTitle, { color: colors.text }]}>
            {file ? 'File selected' : 'Choose an Excel file'}
          </Text>
          <Text style={[styles.dropSubtitle, { color: colors.textSecondary }]}>
            {file ? file.name : 'Uploading replaces only your lead list'}
          </Text>

          {file ? (
            <View style={[styles.fileMeta, { backgroundColor: colors.primarySoft }]}>
              <Text style={[styles.fileMetaText, { color: colors.primary }]}>
                Size: {formatFileSize(file.size)}
              </Text>
            </View>
          ) : null}
        </View>

        <Button
          mode="outlined"
          icon="file-find-outline"
          onPress={pickFile}
          style={[styles.pickButton, { borderColor: colors.primary }]}
          contentStyle={styles.buttonContent}
        >
          {file ? 'Choose Another File' : 'Select Excel File'}
        </Button>

        {file ? (
          <Button
            mode="text"
            onPress={clearFile}
            textColor={colors.textSecondary}
            style={styles.clearButton}
          >
            Remove file
          </Button>
        ) : null}

        {error ? (
          <HelperText type="error" visible style={styles.message}>
            {error}
          </HelperText>
        ) : null}

        {success ? (
          <HelperText type="info" visible style={[styles.successMessage, { color: colors.success }]}>
            {success}
          </HelperText>
        ) : null}

        <Button
          mode="contained"
          icon="upload"
          onPress={handleUpload}
          loading={uploading}
          disabled={uploading || !file}
          style={[styles.uploadButton, { backgroundColor: colors.primary }]}
          contentStyle={styles.buttonContent}
        >
          Import Leads
        </Button>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  infoCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
  },
  infoText: {
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  columnsText: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
    fontWeight: '600',
  },
  uploadCard: {
    borderRadius: 18,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  dropZone: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 14,
    marginBottom: 16,
  },
  dropTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginTop: 12,
  },
  dropSubtitle: {
    fontSize: fontSize.sm,
    marginTop: 6,
    textAlign: 'center',
  },
  fileMeta: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  fileMetaText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  pickButton: {
    borderRadius: 8,
  },
  clearButton: {
    marginTop: 4,
  },
  uploadButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  message: {
    marginTop: 8,
  },
  successMessage: {
    marginTop: 8,
  },
})
