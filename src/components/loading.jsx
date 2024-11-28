import '../style/loading_component/loading.css'

const Loading = ({ loading }) => {
  if (!loading) return null;

  return (
    <>
      <div className="container-loading">
        <div className="loading"></div>
      </div>
    </>
  )
}

export default Loading
