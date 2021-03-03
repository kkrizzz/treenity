export const serializeSchema = ({nodes, links}) => {
    return {
        nodes: nodes.map(({id, content, coordinates, inputs, outputs, payload})=>{
            return {
                _id: id,
                content,
            }
        }),
        links: links.map(()=>{

        })
    }
}