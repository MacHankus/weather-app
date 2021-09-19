import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import SubjectIcon from '@material-ui/icons/Subject'
import PublicIcon from '@material-ui/icons/Public'
import { useHistory } from 'react-router'




const useStyles = makeStyles({
  list: {
    width: 250,
  }
});
type LeftDrawerProps = {
  open: boolean,
  setDrawerOpen: Function
}
export default function LeftDrawer({ open, setDrawerOpen }: LeftDrawerProps) {
  const classes = useStyles()
  const history = useHistory()


  const changeRoute = (route: string) => {
    return () => history.push(route)
  }
  console.log(open)
  const list = () => (
    <div
      className={clsx(classes.list)}
      role="presentation"
      onClick={setDrawerOpen(false)}
      onKeyDown={setDrawerOpen(false)}
    >
      <List>
        <ListItem button key={"My places"} onClick={changeRoute('/my-places')}>
          <ListItemIcon><SubjectIcon /></ListItemIcon>
          <ListItemText primary={"My places"} />
        </ListItem>
        <ListItem button key={"Explore"} onClick={changeRoute('/explore')}>
          <ListItemIcon><PublicIcon /></ListItemIcon>
          <ListItemText primary={"Explore"} />
        </ListItem>
      </List>
      <Divider />
    </div>
  );

  return (
    <div>
      <React.Fragment key={"left"}>
        <Drawer anchor="left" open={open} onClose={setDrawerOpen(false)}>
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
