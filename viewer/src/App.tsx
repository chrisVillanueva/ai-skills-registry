import { useState, useEffect } from 'react'
import { FileTree } from './components/FileTree'
import { MarkdownViewer } from './components/MarkdownViewer'
import type { TreeNode } from './types'

const styles = {
  app: {
    display: 'flex',
    height: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    margin: 0,
    color: '#e0e0e0',
    backgroundColor: '#1a1a2e',
  } as React.CSSProperties,
  sidebar: {
    width: '280px',
    minWidth: '280px',
    backgroundColor: '#16213e',
    borderRight: '1px solid #2a2a4a',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  } as React.CSSProperties,
  sidebarHeader: {
    padding: '16px',
    borderBottom: '1px solid #2a2a4a',
    fontSize: '14px',
    fontWeight: 600,
    color: '#a0c4ff',
    letterSpacing: '0.5px',
  } as React.CSSProperties,
  treeContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 0',
  } as React.CSSProperties,
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  } as React.CSSProperties,
  empty: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    fontSize: '15px',
  } as React.CSSProperties,
}

export default function App() {
  const [tree, setTree] = useState<TreeNode[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/tree')
      .then((r) => r.json())
      .then(setTree)
  }, [])

  useEffect(() => {
    if (!selectedFile) return
    setLoading(true)
    fetch(`/api/file?path=${encodeURIComponent(selectedFile)}`)
      .then((r) => r.json())
      .then((data) => {
        setFileContent(data.content)
        setLoading(false)
      })
  }, [selectedFile])

  return (
    <div style={styles.app}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>Skills Registry</div>
        <div style={styles.treeContainer}>
          <FileTree
            nodes={tree}
            selectedPath={selectedFile}
            onSelect={setSelectedFile}
          />
        </div>
      </div>
      <div style={styles.main}>
        {selectedFile ? (
          <MarkdownViewer
            filePath={selectedFile}
            content={fileContent}
            loading={loading}
          />
        ) : (
          <div style={styles.empty}>Select a file to view</div>
        )}
      </div>
    </div>
  )
}
