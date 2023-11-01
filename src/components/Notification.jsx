const Notification = ({ info }) => {
  if (info === null) {
    return null
  }

  return (
    <div className={info[1]}>
      {info[0]}
    </div>
  )
}

export default Notification