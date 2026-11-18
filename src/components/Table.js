import TableHead from './TableHead.js';
import TableBody from './TableBody.js';
import Filter from './Filter.js';
import { useState } from "react";

/*
   компонент, выводящий на страницу таблицу с пагинацией
   пропсы:
      data - данные для таблицы в виде массива объектов
*/

const Table = (props) => {
   
    const updateDataTable = (value) => {
        props.onFilter(value);
        setActivePage(1);
    }

    const [activePage, setActivePage] = useState("1");
    const changeActive = (event) => {
        setActivePage(event.target.innerHTML);
    };

    const isPag = props.isPag === "1";
    const amountRows = isPag ? props.amountRows : props.filter.length;

	//количество страниц разбиения таблицы
    const n = Math.ceil(props.filter.length / amountRows); 
      
    // массив с номерами страниц
    const arr = Array.from({ length: n }, (v, i) => i + 1);
    
    //формируем совокупность span с номерами страниц
    const pages = arr.map((item, index) =>  
        <span key={ index } 
        className={item == activePage ? "active": ""}
        onClick={ changeActive }> 
        { item } </span>
    );
    if (n==1){
        pages.length=0;
    }

    return( 
      <>
        <h4>Фильтры</h4>
        <Filter 
        filtering={ updateDataTable } 
        data={ props.filter } 
        fullData={ props.data }/>

        <table>
            <TableHead head={ Object.keys(props.data[0]) } />
            <TableBody 
            body={ props.filter } 
            amountRows={ amountRows } 
            numPage={activePage}/>
        </table>

	    {isPag && ( <div className="pag">
                        {pages}
                    </div>
	    )}
      </>   
    )   
}

export default Table;