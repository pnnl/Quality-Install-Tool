import React from 'react'
import { FC, useEffect, useState } from 'react'
import { FloatingLabel } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import { Button } from 'react-bootstrap'

interface ButtonProps {
    id: string
    label: string
    options: string[]
    href: string
}

const ButtonLink: FC<ButtonProps> = ({ id, label, options, href }) => {
    return (
        <div className="bottom-margin">
            <Button id={id} href={href}>
                {label}
            </Button>
        </div>
    )
}

export default ButtonLink
