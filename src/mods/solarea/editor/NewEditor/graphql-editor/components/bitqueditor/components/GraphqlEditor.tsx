import React, {useEffect, useRef} from 'react'
import QueryEditor from './QueryEditor'
import VariableEditor from './VariableEditor'

const GraphqlEditor = ({
                           schema,
                           query,
                           variables,
                           variableToType,
                           onRunQuery,
                           onEditQuery,
                           onEditVariables,
                           number
                       }) => {
    const ref1 = useRef()
    const ref2 = useRef()

    useEffect(() => {
        if(ref1.current)
            ref1.current.getEditor().refresh()

        if(ref1.current)
            ref2.current.getEditor().refresh()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className="editor__wrapper">
            <QueryEditor
                onRunQuery={onRunQuery}
                number={number}
                ref={ref1}
                onEdit={onEditQuery}
                schema={schema}
                value={query}
            />
            <VariableEditor
                number={number}
                ref={ref2}
                onEdit={onEditVariables}
                variableToType={variableToType}
                value={variables}
            />
        </div>
    )
}

export default GraphqlEditor
