import React, {useState, useEffect, useContext} from 'react';
import { AuthContext } from './Auth';
import app from "../base";
import { collection, addDoc, getFirestore } from "firebase/firestore";

import arrowDown from '../assets/ArrowDown.png';
import arrowUp from '../assets/ArrowUp.png';
import recycleIcon from '../assets/SmallRecycleIcon.png';
import shirtIcon from '../assets/SmallShirtIcon.png';
import decoration from '../assets/Decoration.svg';

export function Stepper(){
    //uzytkownik
    const {currentUser} = useContext(AuthContext);

    //step state
    const [currentStep, setCurrentStep] = useState(1)

    //bags state
    const [showBags, setShowBags] = useState(false)

    //location state
    const [showLocation, setShowLocation] = useState(false)

    //form states
    const INITIAL_CHECKBOXES = {
        reusableClothes: false,
        rubbishClothes: false,
        toys: false,
        books: false,
        others: false
    }
    const [checkboxes, setCheckboxes] = useState(INITIAL_CHECKBOXES)

    const [bagAmount, setBagAmount] = useState('wybierz')
    const [location, setLocation] = useState('wybierz')

    const [people, setPeople] = useState('')

    const INITIAL_INPUTS = {
        org: '',
        street: '',
        city: '',
        postcode: '',
        phone: '',
        date: '',
        hour: '',
        notes: ''
    }
    const [inputValue, setInputValue] = useState(INITIAL_INPUTS)

    function handleInput(e){
        e.preventDefault();

        setInputValue({
            ...inputValue,
            [e.target.name]: e.target.value
        })
    }
    
    function handleCheckbox(e){
        if(e.target.checked){
            setCheckboxes({
                ...checkboxes,
                [e.target.name]: true,
            })
        }else{
            setCheckboxes({
                ...checkboxes,
                [e.target.name]: false,
            })
        }
    }

    function handleBags(e){
        e.preventDefault();
        setBagAmount(e.target.getAttribute("data-value"));
    }

    function handleLocation(e){
        e.preventDefault();
        setLocation(e.target.getAttribute("data-value"));
    }

    function handlePeople(e){
        e.preventDefault();
        setPeople(e.target.name);
    }

    function stepForward(e){
        e.preventDefault();
        setCurrentStep(
            prevStep=>{
                if(prevStep<5){
                    return prevStep + 1;
                }else{
                    return prevStep;
                }
            }
        )
    }

    function stepBackward(e){
        e.preventDefault();
        setCurrentStep(
            prevStep=>{
                if(prevStep>1){
                    return prevStep - 1;
                }else{
                    return prevStep;
                }
            }
        )
    }

    function toggleBags(e){
        e.preventDefault();

        if(showBags===true){
            setShowBags(false)
        }else{
            setShowBags(true)
        }
    }

    function toggleLocation(e){
        e.preventDefault();

        if(showLocation===true){
            setShowLocation(false)
        }else{
            setShowLocation(true)
        }
    }

   
    //przes??anie formularza do firestore
    const handleStepperSubmit = async (e) => {
        e.preventDefault();
        setCurrentStep(6); 

        const db = getFirestore(app);
        try {
            const docRef = await addDoc(collection(db, "oddawanie rzeczy"),{
                user: currentUser,
                bagAmount: bagAmount,
                location: location,
                people: people,
                org: inputValue.org,
                street: inputValue.street,
                city: inputValue.city,
                postcode: inputValue.postcode,
                phone: inputValue.phone,
                date: inputValue.date,
                hour: inputValue.hour,
                notes: inputValue.notes,
                whatToGive: checkboxes
                
            });
        }
        catch (error) {
            console.log(error);
        }

    }

    useEffect(()=>{
        setCurrentStep(1);
    },[])

    return(
        <section className="stepper">
            { currentStep<=4 &&
                <h2 className="stepper__header">
                    <span>Wa??ne!</span>
                    {currentStep===1 && <p>"Uzupe??nij szczeg????y dotycz??ce Twoich rzeczy. Dzi??ki temu b??dziemy wiedzie?? komu najlepiej je przekaza??."</p>}
                    {currentStep===2 && <p>"Wszystkie rzeczy do oddania zapakuj w 60l worki. Dok??adn?? instrukcj?? jak poprawnie spakowa?? rzeczy znajdziesz TUTAJ."</p>}
                    {currentStep===3 && <p>"Je??li wiesz komu chcesz pom??c, mo??esz wpisa?? nazw?? tej organizacji w wyszukiwarce. Mo??esz te?? filtrowa?? organizacje po ich lokalizacji b??d?? celu ich pomocy."</p>}
                    {currentStep===4 && <p>"Podaj adres oraz termin odbioru rzeczy."</p>}
                </h2>
            }

            <div className="stepper__container">
                {currentStep<=4 &&
                <p className="stepper__current-step">
                    Krok {currentStep}/4
                </p>}

                {currentStep!=6 &&<form className="stepper__form" id="stepperForm" onSubmit={handleStepperSubmit}>
                    {currentStep===1 && 
                    <div className="stepper__step step--1">
                        <h3 className="stepper-form__title">
                            Zaznacz co chcesz odda??:
                        </h3>

                        <label htmlFor="reusableClothes" className="label--checkbox">
                            <input type="checkbox" name="reusableClothes" className="custom-checkbox"  checked={checkboxes.reusableClothes} onChange={handleCheckbox}/>
                            <p>ubrania, kt??re nadaj?? si?? do ponownego u??ycia</p>
                        </label>

                        <label htmlFor="rubbishClothes"className="label--checkbox">
                            <input type="checkbox" name="rubbishClothes" className="custom-checkbox" checked={checkboxes.rubbishClothes} onChange={handleCheckbox}/>
                            <p>ubrania, do wyrzucenia</p>
                        </label>

                        <label htmlFor="toys" className="label--checkbox">
                            <input type="checkbox" name="toys" className="custom-checkbox" checked={checkboxes.toys} onChange={handleCheckbox}/>
                            <p>zabawki</p>
                        </label>

                        <label htmlFor="books" className="label--checkbox">
                            <input type="checkbox" name="books" className="custom-checkbox"  checked={checkboxes.books} onChange={handleCheckbox}/>
                            <p>ksi????ki</p>
                        </label>

                        <label htmlFor="others" className="label--checkbox">
                            <input type="checkbox" name="others" className="custom-checkbox" checked={checkboxes.others} onChange={handleCheckbox}/>
                            <p>inne</p>
                        </label>
                    </div>
                    }

                    {currentStep===2 && 
                    <div className="stepper__step step--2">
                        <h3 className="stepper-form__title">
                            Podaj liczb?? 60l work??w, w kt??re spakowa??e??/a?? rzeczy:
                        </h3>

                        <div className="custom-select__box">
                            <div className="custom-select" onClick={toggleBags}>
                            Liczba 60l work??w:
                                <div>
                                    <p>{bagAmount}</p>
                                    <img src={ showBags===true ? arrowUp : arrowDown} alt="arrow down"/>
                                </div>
                            </div>

                            { showBags &&<div className='custom-options options--bags'>
                                <p data-value="1" onClick={handleBags}>1</p> 
                                <p data-value="2" onClick={handleBags}>2</p>
                                <p data-value="3" onClick={handleBags}>3</p>
                                <p data-value="4" onClick={handleBags}>4</p>
                                <p data-value="5" onClick={handleBags}>5</p>
                                <p data-value="6" onClick={handleBags}>6</p>
                            </div>}

                        </div>
                    </div>
                    }

                    {currentStep===3 && 
                    <div className="stepper__step step--3">
                        <h3 className="stepper-form__title">
                           Lokalizacja:
                        </h3>

                        <div className="custom-select__box">
                            <div className="custom-select" onClick={toggleLocation}>
                                <div>
                                    <p>{location}</p>
                                    <img src={ showLocation===true ? arrowUp : arrowDown} alt="arrow down"/>
                                </div>
                            </div>

                            { showLocation &&<div className='custom-options options--locations'>
                                <p data-value="Pozna??" onClick={handleLocation}>Pozna??</p>
                                <p data-value="Warszawa" onClick={handleLocation}>Warszawa</p>
                                <p data-value="Krak??w" onClick={handleLocation}>Krak??w</p>
                                <p data-value="Wroc??aw" onClick={handleLocation}>Wroc??aw</p>
                                <p data-value="Katowice" onClick={handleLocation}>Katowice</p>
                                <p data-value="????d??" onClick={handleLocation}>????d??</p>
                            </div>}
                        </div>

                        <p className='stepper__step-description'>
                            Komu chcesz pom??c?
                        </p>
                        <div className='step-help__boxes'>
                            <input type="button" className={people==='kids' ? 'button button--small stepper__selected-btn' : 'button button--small'} name="kids" value="dzieciom" onClick={handlePeople}/>
                            <input type="button" className={people==='mothers' ? 'button button--small stepper__selected-btn' : 'button button--small'} name="mothers" value="samotnym matkom" onClick={handlePeople}/>
                            <input type="button" className={people==='homeless' ? 'button button--small stepper__selected-btn' : 'button button--small'} name="homeless" value="bezdomnym" onClick={handlePeople}/>
                            <input type="button" className={people==='disabled' ? 'button button--small stepper__selected-btn' : 'button button--small'} name="disabled" value="niepe??nosprawnym" onClick={handlePeople}/>
                            <input type="button" className={people==='elderly' ? 'button button--small stepper__selected-btn' : 'button button--small'} name="elderly" value="osobom starszym" onClick={handlePeople}/>
                        </div>

                        <p className='stepper__step-description'>
                            Wpisz nazw?? konkretnej organizacji (opcjonalnie)
                        </p>
                        <input type="text" className='stepper__custom-input custom-input--org' name="org" value={inputValue.org} onChange={handleInput}/>
                    </div>}
                    
                    {currentStep===4 && 
                    <div className="stepper__step step--4">
                        <h3 className="stepper-form__title">
                            Podaj adres oraz termin odbioru rzecz przez kuriera
                        </h3>

                        <div className='step__last-box'>
                            <div className='step__address'>
                                <p className='stepper__step-description'>
                                    Adres odbioru:
                                </p>

                                <label htmlFor="street" className='label--last-box'>
                                    Ulica
                                    <input type="text" name="street" className="stepper__custom-input input--final-box" value={inputValue.street} onChange={handleInput}/>
                                </label>

                                <label htmlFor="city" className='label--last-box'>
                                    Miasto
                                    <input type="text" name="city" className="stepper__custom-input input--final-box" value={inputValue.city} onChange={handleInput}/>
                                </label>

                                <label htmlFor="postcode" className='label--last-box'>
                                    Kod<br/>
                                    pocztowy
                                    <input type="text" name="postcode" className="stepper__custom-input input--final-box" value={inputValue.postcode} onChange={handleInput}/>
                                </label>

                                <label htmlFor="phone" className='label--last-box'>
                                    Numer<br/>
                                    telefonu
                                    <input type="text" name="phone" className="stepper__custom-input input--final-box" value={inputValue.phone} onChange={handleInput}/>
                                </label>
                            </div>

                            <div className='step__term'>
                                <p className='stepper__step-description'>
                                    Termin odbioru:
                                </p>

                                <label htmlFor="date" className='label--last-box'>
                                    Data
                                    <input type="date" name="date" className="stepper__custom-input input--final-box" value={inputValue.date} onChange={handleInput}/>
                                </label>

                                <label htmlFor="hour" className='label--last-box'>
                                    Godzina
                                    <input type="text" name="hour" className="stepper__custom-input input--final-box" value={inputValue.hour} onChange={handleInput}/>
                                </label>

                                <label htmlFor="notes" className='label--notes'>
                                    Uwagi <br/> 
                                    dla kuriera
                                    <textarea name="notes" rows="4" className="stepper__custom-input input--final-box" value={inputValue.notes} onChange={handleInput}/>
                                </label>
                            </div>
                        </div>
                    </div>}
                    
                    {currentStep===5 && 
                    <div className="stepper__step step--5">
                        <h3 className="stepper-form__title">
                            Podsumowanie Twojej darowizny
                        </h3>

                        <p className='stepper__step-description'>
                            Oddajesz:
                        </p>

                        <p className='stepper__summary-line summary-line--first'>
                            <img src={shirtIcon} alt="shirt icon"/> {bagAmount && `${bagAmount} worki`}
                            {checkboxes.reusableClothes && ', ubrania w dobrym stanie'}
                            {checkboxes.rubbishClothes && ', ubrania w s??abym stanie'}
                            {checkboxes.toys && ', zabawki'}
                            {checkboxes.books && ', ksi????ki'}
                            {checkboxes.others && ', inne'}
                 
                            {people==='kids' && ', dzieciom'}
                            {people==='mothers' && ', samotnym matkom'} 
                            {people==='homeless' && ', bezdomnym'} 
                            {people==='disabled' && ', niepe??nosprawnym'}  
                            {people==='elderly' && ', osobom starszym'}  
                        </p>

                        <p className='stepper__summary-line summary-line--first'>
                            <img src={recycleIcon} alt="shirt icon"/> dla lokalizacji: {location}
                        </p>

                        <div className='step__last-box last-box--summary'>
                            <div className='step__address'>
                                <p className='stepper__step-description'>
                                    Adres odbioru: 
                                </p>

                                <div className='stepper__summary-line'>
                                    <p>
                                        Ulica
                                    </p>
                                    <p>
                                        {inputValue.street}
                                    </p>
                                </div>

                                <div className='stepper__summary-line'>
                                    <p>
                                        Miasto
                                    </p>
                                    <p>
                                        {inputValue.city}
                                    </p>
                                </div>

                                <div className='stepper__summary-line'>
                                    <p>
                                        Kod<br/>
                                        pocztowy
                                    </p>
                                    <p>
                                        {inputValue.postcode}
                                    </p>
                                </div>

                                <div className='stepper__summary-line'>
                                    <p>
                                        Numer<br/>
                                        telefonu
                                    </p>
                                    <p>
                                        {inputValue.phone}
                                    </p>
                                </div>
                            </div>

                            <div className='step__term'>
                                <p className='stepper__step-description'>
                                    Termin odbioru:
                                </p>

                                <div className='stepper__summary-line'>
                                    <p>
                                        Data
                                    </p>
                                    <p>
                                        {inputValue.date}
                                    </p>
                                </div>

                                <div className='stepper__summary-line'>
                                    <p>
                                        Godzina
                                    </p>
                                    <p>
                                        {inputValue.hour}
                                    </p>
                                </div>

                                <div className='stepper__summary-line summary-line--last'>
                                    <p>
                                        Uwagi<br/>
                                        dla kuriera
                                    </p>
                                    <p>
                                        {inputValue.notes}
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>}
                </form>}

                {currentStep===6 && <div className="step--6">
                    <div>
                        <h3 className="stepper-form__title">
                        Dzi??kujemy za przes??anie formularza Na maila prze??lemy wszelkie informacje o odbiorze.
                        </h3>
                        <img src={decoration} alt="text decoration"/>
                    </div>
                </div>}

                {currentStep!=6 && <div className="stepper__buttons">
                    { currentStep >1 && currentStep<6 && <input type="button"  className="button button--middle button--stepper" value="Wstecz" onClick={stepBackward}/>}
                    {  currentStep <5 && <input type="button" className="button button--middle button--stepper"  value="Dalej" onClick={stepForward}/>}
                    {  currentStep===5 && <input type="submit" form="stepperForm" className="button button--middle button--stepper"  value="Potwierdzam" />}
                </div>}
            </div>
        </section>
    )
}