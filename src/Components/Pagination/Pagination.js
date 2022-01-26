import "./Pagination.css";

export function Pagination(props) {
  let arrayEmpty = new Array(Math.ceil((props.totalData)/10)).fill(0);//up
  
  return (
    <>
      <section className="pagination">
        {
          arrayEmpty.map((el, index) => <button className={props.state/10 ===  index ?"indicador":""} onClick={() => props.setState(index*10)} key={index}> {index+1} </button>)
        }
      </section>
    </>
  );
}