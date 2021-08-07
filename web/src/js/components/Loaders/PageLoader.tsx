import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { FixedScreen } from './common'

const PageLoader = () => {
    return <FixedScreen>
        <CircularProgress />
    </FixedScreen>
}
export default PageLoader