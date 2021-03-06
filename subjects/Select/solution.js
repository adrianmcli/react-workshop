////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Make this work like a normal <select> box!
////////////////////////////////////////////////////////////////////////////////
import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import "./styles.css"

class Select extends React.Component {
  static propTypes = {
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    onChange: PropTypes.func
  }

  state = {
    value: this.props.value || this.props.defaultValue,
    showOptions: false
  }

  toggleOptions = () => {
    this.setState(state => ({
      showOptions: !state.showOptions
    }))
  }

  isControlled() {
    return this.props.value != null
  }

  componentWillMount() {
    if (this.isControlled() && !this.props.onChange) {
      console.warn(
        "You must provide an onChange to a controlled <Select>, or it is going to be read-only"
      )
    }
  }

  getLabel() {
    const value = this.isControlled() ? this.props.value : this.state.value

    let label
    React.Children.forEach(this.props.children, child => {
      if (child.props.value === value) label = child.props.children
    })

    return label
  }

  handleSelect(value) {
    if (this.isControlled()) {
      if (this.props.onChange) this.props.onChange(value)
    } else {
      this.setState({ value }, () => {
        if (this.props.onChange) this.props.onChange(this.state.value)
      })
    }
  }

  render() {
    return (
      <div className="select" onClick={this.toggleOptions}>
        <div className="label">
          {this.getLabel()} <span className="arrow">▾</span>
        </div>
        {this.state.showOptions && (
          <div className="options">
            {React.Children.map(this.props.children, child => {
              return React.cloneElement(child, {
                onSelect: () => this.handleSelect(child.props.value)
              })
            })}
          </div>
        )}
      </div>
    )
  }
}

class Option extends React.Component {
  render() {
    return (
      <div className="option" onClick={this.props.onSelect}>
        {this.props.children}
      </div>
    )
  }
}

class App extends React.Component {
  state = {
    selectValue: "dosa"
  }

  setToMintChutney = () => {
    this.setState({ selectValue: "mint-chutney" })
  }

  render() {
    return (
      <div>
        <h1>Select/Option</h1>

        <pre>{JSON.stringify(this.state, null, 2)}</pre>

        <h2>Controlled</h2>
        <p>
          <button onClick={this.setToMintChutney}>Set to Mint Chutney</button>
        </p>

        <Select
          value={this.state.selectValue}
          onChange={value => this.setState({ selectValue: value })}
        >
          <Option value="tikka-masala">Tikka Masala</Option>
          <Option value="tandoori-chicken">Tandoori Chicken</Option>
          <Option value="dosa">Dosa</Option>
          <Option value="mint-chutney">Mint Chutney</Option>
        </Select>

        <h2>Uncontrolled</h2>
        <Select defaultValue="tikka-masala">
          <Option value="tikka-masala">Tikka Masala</Option>
          <Option value="tandoori-chicken">Tandoori Chicken</Option>
          <Option value="dosa">Dosa</Option>
          <Option value="mint-chutney">Mint Chutney</Option>
        </Select>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("app"))
