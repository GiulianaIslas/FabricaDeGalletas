import {useState,useContext} from "react";
import FormInput from "../Form-input/form-input.component.js";
import Button from "../button/button.component.js";
import {UpdateContext} from "../../Context/update.context.js";
import './ingredient-form.styles.scss';
const IngredientForm = () =>{
    const defaultFormFields = {
        name:'',
        quantity:'',
    }
    const {setChange} = useContext(UpdateContext);
    const [formFields,setFormFields]=useState(defaultFormFields);
    const {name,quantity } = formFields;
    const [success,setSuccess] = useState(false);
    const [containerIndex, setContainerIndex] = useState(0);

    const handleChange = (event) => {
        event.preventDefault();
        const {name,value} = event.target;
        setFormFields({...formFields,[name]:value.toLowerCase()});
    }

    const handleNumberChange = (event) => {
        event.preventDefault();
        setFormFields({...formFields,['quantity']:event.target.valueAsNumber});
    }

    const sumbitData = (event) => {
        event.preventDefault();
        
        const postData = async() => {
            await fetch("http://localhost:3000/api/addIngredient",{
                method:"POST",
                headers: {
                    "Content-type" : "application/json"
                },
                body:JSON.stringify(formFields),
            })
            .then(response=>{
                console.log(response);
                setFormFields(defaultFormFields);
                setContainerIndex(1);
                setChange(true);
                setSuccess(true);
            })
            .catch( e => console.log(e) );
        }
        postData();
    }

    const handleClick = () => {
        setContainerIndex(0);
        setFormFields(defaultFormFields);
        setSuccess(false);
        setChange(false);
    }

    if (containerIndex===0)
        return(
            <div className='ingredient-container'>
                <h2>Añadir Ingrediente</h2>
                <form onSubmit={sumbitData} className='form-container'>
                    <FormInput label='Cantidad' required type='number' onChange={handleNumberChange} name='quantity' value={quantity} />
                    <FormInput label='Nombre' required type='text' onChange={handleChange} name='name' value={name} />
                    <Button type='submit'  buttonType='dark' >ACEPTAR</Button>
                </form>
            </div>
        );

    if (containerIndex===1 && success)
        return (
            <div className='ingredient-container'>
                <h2>Ingrediente Agregado!</h2>
                <p>El ingrediente <em>{name.toUpperCase()}</em> fue agregado exitosamente al inventario. </p>
                <Button type='button'  buttonType='dark' onClick={handleClick}>REGRESAR</Button>
            </div>
        );

    if (containerIndex===1 && !success)
        return (
            <div className='ingredient-container'>
                <h2>ERROR</h2>
                <p>El ingrediente <em>{name.toUpperCase()}</em> no se pude agregar al inventario. Intente de nuevo.</p>
                <Button type='button'  buttonType='dark' onClick={handleClick}>REGRESAR</Button>
            </div>
        );
};
export default IngredientForm