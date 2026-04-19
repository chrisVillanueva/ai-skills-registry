import { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownViewerProps {
  filePath: string
  content: string
  loading: boolean
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    borderBottom: '1px solid #2a2a4a',
    backgroundColor: '#16213e',
    minHeight: '20px',
  } as React.CSSProperties,
  filePath: {
    fontSize: '13px',
    color: '#8a8aaa',
    fontFamily: 'monospace',
  } as React.CSSProperties,
  toggle: {
    display: 'flex',
    gap: '0px',
    borderRadius: '6px',
    overflow: 'hidden',
    border: '1px solid #2a2a4a',
  } as React.CSSProperties,
  toggleBtn: (active: boolean) => ({
    padding: '5px 14px',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
    backgroundColor: active ? '#2a3f6e' : '#1a1a2e',
    color: active ? '#fff' : '#888',
    transition: 'all 0.15s',
  }) as React.CSSProperties,
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '24px 32px',
  } as React.CSSProperties,
  raw: {
    whiteSpace: 'pre-wrap',
    fontFamily: '"SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace',
    fontSize: '13px',
    lineHeight: 1.6,
    color: '#c8c8d8',
    tabSize: 2,
  } as React.CSSProperties,
  loading: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
  } as React.CSSProperties,
}

const markdownStyles = `
  .md-preview {
    color: #d4d4e8;
    line-height: 1.7;
    font-size: 15px;
  }
  .md-preview h1 {
    font-size: 1.8em;
    border-bottom: 1px solid #2a2a4a;
    padding-bottom: 8px;
    margin-top: 0;
    color: #e8e8ff;
  }
  .md-preview h2 {
    font-size: 1.4em;
    border-bottom: 1px solid #2a2a4a;
    padding-bottom: 6px;
    margin-top: 32px;
    color: #c8c8ff;
  }
  .md-preview h3 {
    font-size: 1.15em;
    margin-top: 24px;
    color: #a0c4ff;
  }
  .md-preview code {
    background: #2a2a4a;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
    font-family: "SF Mono", "Fira Code", Menlo, Consolas, monospace;
    color: #e8b4b8;
  }
  .md-preview pre {
    background: #0f0f23;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    border: 1px solid #2a2a4a;
  }
  .md-preview pre code {
    background: none;
    padding: 0;
    color: #c8c8d8;
  }
  .md-preview table {
    border-collapse: collapse;
    width: 100%;
    margin: 16px 0;
    font-size: 14px;
  }
  .md-preview th {
    background: #1e2d4d;
    text-align: left;
    padding: 10px 12px;
    border: 1px solid #2a2a4a;
    color: #a0c4ff;
    font-weight: 600;
  }
  .md-preview td {
    padding: 8px 12px;
    border: 1px solid #2a2a4a;
  }
  .md-preview tr:nth-child(even) {
    background: #1a1a30;
  }
  .md-preview blockquote {
    border-left: 3px solid #4a4a7a;
    padding-left: 16px;
    margin-left: 0;
    color: #9a9aba;
  }
  .md-preview ul, .md-preview ol {
    padding-left: 24px;
  }
  .md-preview li {
    margin: 4px 0;
  }
  .md-preview strong {
    color: #e0e0ff;
  }
  .md-preview a {
    color: #6db3f2;
  }
  .md-preview hr {
    border: none;
    border-top: 1px solid #2a2a4a;
    margin: 24px 0;
  }
`

export function MarkdownViewer({ filePath, content, loading }: MarkdownViewerProps) {
  const [mode, setMode] = useState<'preview' | 'raw'>('preview')

  if (loading) {
    return <div style={styles.loading}>Loading...</div>
  }

  return (
    <>
      <style>{markdownStyles}</style>
      <div style={styles.header}>
        <span style={styles.filePath}>{filePath}</span>
        <div style={styles.toggle}>
          <button
            style={styles.toggleBtn(mode === 'preview')}
            onClick={() => setMode('preview')}
          >
            Preview
          </button>
          <button
            style={styles.toggleBtn(mode === 'raw')}
            onClick={() => setMode('raw')}
          >
            Raw
          </button>
        </div>
      </div>
      <div style={styles.content}>
        {mode === 'raw' ? (
          <div style={styles.raw}>{content}</div>
        ) : (
          <div className="md-preview">
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
          </div>
        )}
      </div>
    </>
  )
}
