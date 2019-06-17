import React from "react";
import { Icon } from "antd";
import { DragSource, DropTarget } from "react-dnd";
import { store, INSERT_CODE_AT, DELETE_BY_ID } from "./App";


export const DnD = function(type) {
  /**
 * Implements the drag source contract.
 */
const buttonDragSource = {
  beginDrag(props) {
    return {
      code: props.code,
      id: props.id
    };
  }
};

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const slateTarget = {
  //what happens when drop occurs
  drop(props, monitor) {
    console.log("droppped", monitor.getItem(), "props", props);

    store.dispatch({
      type: DELETE_BY_ID,      
      id: monitor.getItem().id
    })

    store.dispatch({
      type: INSERT_CODE_AT,
      code: monitor.getItem().code,
      id: props.id
    })    
  }
};

function collectDrop(connect, monitor) {
  // some function required for drop  
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class Wrapper extends React.Component {
  state = { showInfo: false };

  render() {
    return this.props.connectDropTarget(
      this.props.connectDragSource(
        <span
          onMouseOver={() => this.setState({ showInfo: true })}
          onMouseOut={() => this.setState({ showInfo: false })}
          style={this.state.style}
        >
          <span
            style={{
              background: "rgba(200,200,200,0.5)",
              border: "thin dashed #777",
              borderRadius: "5px",
              display: this.state.showInfo ? "" : "none",
              position: "absolute",
              top: "20",
              left: "20",
              zIndex: "100"
            }}
          >
            <Icon type="edit" />
            <Icon type="drag" />
            <Icon type="delete" onClick={()=>store.dispatch({
      type: DELETE_BY_ID,      
      id: this.props.id
    })}/>
          </span>
          {React.createElement(type, this.props, this.props.children)}
        </span>
      )
    );
  }
}

  return DropTarget("draggable", slateTarget, collectDrop)(
    DragSource("draggable", buttonDragSource, collect)(Wrapper)
  )
}