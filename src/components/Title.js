import React from 'react'

const title = props => {
    return (
        <div className="row">
            <div className="col-10 mx-auto my-2 text-center text-title">
                <h1 className="text-capitalize font-weight-bold"></h1>
    {props.name} <strong className="text-blue">{props.title}</strong>
            </div>
        </div>
    )
}

export default title;
