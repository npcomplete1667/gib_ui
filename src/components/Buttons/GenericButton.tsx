function GenericButton({ id, text, color, isSelected, handler }
    :
    { id:number, text:string, color:string, isSelected:boolean, handler:any }) {
    return (
        <button
            className={`${isSelected ? `bg-${color}-600` : `bg-gray-800`}
            hover:${isSelected ? `bg-${color}-500` : `bg-gray-700`} 
            m-1 block w-full rounded-lg px-8 py-3 text-center text-sm font-semibold text-white outline-none  transition duration-100 focus-visible:ring  md:text-base`}
            type="button"
            onClick={() => handler(id)}
        >
            {text}
        </button>
    );
}

export default GenericButton;
