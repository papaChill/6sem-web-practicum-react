
/*
   компонент, для фильтрации таблицы
   пропсы:
      fullData - полные данные, по которым формировалась таблица при загрузке страницы
      data - данные для фильтрации
	  filtering - функция обновления данных для фильтрации
*/

const Filter = (props) => {
			
    const handleSubmit= (event) => {        
        event.preventDefault();		

		// создаем словарь со значениями полей формы
		const filterField = {
			"Название": event.target["structure"].value.toLowerCase(),
		    "Тип": event.target["type"].value.toLowerCase(),
            "Страна": event.target["country"].value.toLowerCase(),
            "Город": event.target["city"].value.toLowerCase(),
            "Год": [
                Number(event.target["yearMin"].value) || 0, 
                Number(event.target["yearMax"].value) || Infinity
            ],
            "Высота": [
                Number(event.target["heightMin"].value) || 0, 
                Number(event.target["heightMax"].value) || Infinity
            ]
	    };
			
        //фильтруем данные по значениям всех полей формы
        let arr = props.fullData;
        for(const key in  filterField) {
			if (Array.isArray(filterField[key])) {
                // Логика для ЧИСЛОВЫХ ИНТЕРВАЛОВ (Год, Высота)
                const [min, max] = filterField[key];
                arr = arr.filter(item => item[key] >= min && item[key] <= max);
            } else {
                // Логика для СТРОК (включая пустые значения)
                arr = arr.filter(item => 
                    item[key].toLowerCase().includes(filterField[key])
                );  
            }  
        }                       
        //передаем родительскому компоненту новое состояние - отфильтрованный массив
        props.filtering(arr);
	}

    const handleReset = () => {
        props.filtering(props.fullData);
    }

    return (
        <form onSubmit={ handleSubmit } onReset={handleReset}>
            <p>
                <label>Название:</label>
                <input name="structure" type="text" />
            </p>  
            <p>
                <label>Тип:</label>		
                <input name="type" type="text" />
            </p>
            <p>
                <label>Страна:</label> 
                <input name="country" type="text" />
            </p>
            <p>
                <label>Город:</label> 
                <input name="city" type="text" />
            </p>
            <p>
                <label>Год от:</label>
                <input name="yearMin" type="number" /> 
            </p>
            <p>
                <label>Год до:</label> 
                <input name="yearMax" type="number" />
                
            </p>
            <p>
                <label>Высота от:</label> 
                <input name="heightMin" type="number" />
            </p>
            <p>  
                <label>Высота до:</label> 
                <input name="heightMax" type="number" />
                
            </p>

            <p>         
                <button type="submit">Фильтровать</button>   
                <button type="reset">Очистить фильтр</button>
            </p>
        </form> 
    )
}

export default Filter;
