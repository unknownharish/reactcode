import React from 'react'

export default function Tabledata({data}) {
    return (
        <>
            <tr className='bg-gray-200 '>
                {/* <td>{data.text}</td> */}
                <td align='center' >{data.type}</td>
                <td align='center'>{data.key}</td>
                <td align='center'>{data.value}</td>
            </tr>
        </>
    )
}
