import { useState } from 'react'
import type { TreeNode } from '../types'

interface FileTreeProps {
  nodes: TreeNode[]
  selectedPath: string | null
  onSelect: (path: string) => void
  depth?: number
}

const styles = {
  item: {
    cursor: 'pointer',
    padding: '4px 12px',
    fontSize: '13px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    borderRadius: '4px',
    margin: '1px 4px',
    transition: 'background-color 0.15s',
  } as React.CSSProperties,
  dirLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontWeight: 500,
    color: '#a0c4ff',
  } as React.CSSProperties,
  fileLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#c0c0c0',
  } as React.CSSProperties,
}

export function FileTree({ nodes, selectedPath, onSelect, depth = 0 }: FileTreeProps) {
  return (
    <div>
      {nodes.map((node) => (
        <TreeItem
          key={node.path}
          node={node}
          selectedPath={selectedPath}
          onSelect={onSelect}
          depth={depth}
        />
      ))}
    </div>
  )
}

function TreeItem({
  node,
  selectedPath,
  onSelect,
  depth,
}: {
  node: TreeNode
  selectedPath: string | null
  onSelect: (path: string) => void
  depth: number
}) {
  const [expanded, setExpanded] = useState(true)
  const isSelected = node.path === selectedPath
  const paddingLeft = 12 + depth * 16

  if (node.type === 'directory') {
    return (
      <div>
        <div
          style={{
            ...styles.item,
            paddingLeft,
            backgroundColor: 'transparent',
          }}
          onClick={() => setExpanded(!expanded)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1e2d4d'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <div style={styles.dirLabel}>
            <span style={{ fontSize: '10px', width: '12px', display: 'inline-block' }}>
              {expanded ? '▼' : '▶'}
            </span>
            <span>{node.name}/</span>
          </div>
        </div>
        {expanded && node.children && (
          <FileTree
            nodes={node.children}
            selectedPath={selectedPath}
            onSelect={onSelect}
            depth={depth + 1}
          />
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        ...styles.item,
        paddingLeft: paddingLeft + 16,
        backgroundColor: isSelected ? '#2a3f6e' : 'transparent',
        color: isSelected ? '#fff' : '#c0c0c0',
      }}
      onClick={() => onSelect(node.path)}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.backgroundColor = '#1e2d4d'
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      <div style={styles.fileLabel}>
        <span style={{ fontSize: '11px' }}>📄</span>
        <span>{node.name}</span>
      </div>
    </div>
  )
}
