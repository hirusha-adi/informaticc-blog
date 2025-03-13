import React, { useState } from 'react'

const CommandGenWithCheckbox = ({ baseCommand, softwareData }) => {
  // track selected packages
  const [selectedSoftware, setSelectedSoftware] = useState([])
  const [isCopied, setIsCopied] = useState(false)

  //  toggle package selection
  function toggleSelection(command) {
    const selectedIndex = selectedSoftware.indexOf(command)
    if (selectedIndex === -1) {
      setSelectedSoftware([...selectedSoftware, command])
    } else {
      const updatedSelection = [...selectedSoftware]
      updatedSelection.splice(selectedIndex, 1)
      setSelectedSoftware(updatedSelection)
    }
  }

  function generateCommand() {
    const [isCopied, setIsCopied] = useState(false)
    const command_tmp = selectedSoftware.join(' ')
    const command = baseCommand + command_tmp

    const handleCopyClick = () => {
      copyToClipboard(command)
      setIsCopied(true)
    }

    const handleCloseClick = () => {
      setIsCopied(false)
    }

    return (
      <div>
        <h4>Selected Software:</h4>
        <textarea
          value={command}
          rows={3}
          style={{
            width: '100%',
            minHeight: '100px',
            border: '1px solid #ccc',
            resize: 'none',
          }}
          onChange={e => {
            e.preventDefault()
          }}
        />
        <button onClick={handleCopyClick} className="button button--success">
          Copy Command
        </button>

        {isCopied && (
          <div className="alert alert--success" role="alert" style={{ marginTop: '20px' }}>
            <button
              aria-label="Close"
              className="clean-btn close"
              type="button"
              onClick={handleCloseClick}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <strong>Successfully copied to clipboard!</strong>
          </div>
        )}
      </div>
    )
  }

  function copyToClipboard(text) {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    setIsCopied(true)
  }

  return (
    <div>
      <div id="software-list">
        {softwareData.map(category => (
          <div key={category.category} className="category">
            <h4>{category.category}</h4>
            {category.items.map(item => (
              <div key={item.name} className="custom-checkbox-item">
                <input
                  type="checkbox"
                  id={item.name}
                  checked={selectedSoftware.includes(item.command)}
                  onChange={() => toggleSelection(item.command)}
                  className="custom-checkbox"
                />
                <label htmlFor={item.name}>{item.name}</label>
              </div>
            ))}
          </div>
        ))}
      </div>
      {generateCommand()}
    </div>
  )
}

export default CommandGenWithCheckbox
