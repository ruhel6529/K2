import React, {useRef, useState, useEffect} from "react";
import {GridLoader} from "react-spinners";

import FrostedContainer from "@/components/common/FrostedContainer";
import {Button, Icon, Slider} from "@mui/material";
import {colors} from "@/utils/Colors";
import styles from './index.module.css'
import {FileUploader} from "react-drag-drop-files";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {useAuth} from "@/context/Auth";
import toast, {Toaster} from "react-hot-toast";
import {v4 as uuidv4} from "uuid";
import NumberOfImagesSlider from "@/components/common/Slider";

const ImageEditor = ({setMedia}) => {
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [imageId, setImageId] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [pos, setPos] = useState({x: 0, y: 0});
    const [posText, setPosText] = useState({xText: 'center', yText: 'center'})



    const [userPrompt, setUserPrompt] = useState<string>("");
    const [negativeUserPrompt, setNegativeUserPrompt] = useState<string>("");
    const [numberOfImages, setNumberOfImages] = useState<number>(4);
    const [editorImage, setEditorImage] = useState(null);
    const [editorPosition, setEditorPosition] = useState({x: 'center', y: 'center'});
    const [credits, setCredits] = useState(0);
    const [scaleFactor, setScaleFactor] = useState(0.7)// Initial scaling factor
const supabase = useSupabaseClient()
    const {user} = useAuth()


    useEffect(() =>{
        (async () => {
            await getCredits()
        })();
    },[])

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);



        if (image) {

            const scaledWidth = image.width * scaleFactor / 2;
            const scaledHeight = image.height * scaleFactor / 2;
            const x = pos.x + (image.width - scaledWidth) / 2;
            const y = pos.y + (image.height - scaledHeight) / 2;
            ctx.drawImage(image, x, y, scaledWidth, scaledHeight);

        }
    }, [imageId, pos, posText, scaleFactor]);


    const handleImageUpload = (img) => {
        setLoading(true);
        if (!img) return;

        const formData = new FormData();
        formData.append("image", img);

        fetch(`${process.env.NEXT_PUBLIC_API_HOST}/v1/uploadImage`, {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOKKER_API_KEY}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {

                if (data.cutout_image) {
                    const cutoutImg = new Image();
                    cutoutImg.onload = () => {
                        const canvas = canvasRef.current;
                        const initialX = (canvas.width - cutoutImg.width) / 2;
                        const initialY = (canvas.height - cutoutImg.height) / 2;
                        setPos({x: initialX, y: initialY});
                        setImage(cutoutImg);
                        setLoading(false);
                        setImageId(data.id);
                    };
                    cutoutImg.src = data.cutout_image.url;
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    handleImageUpload(file);
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMouseDown = (e) => {
        if (image) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left - (image.width * 0.4) / 2;
            const y = e.clientY - rect.top - (image.height * 0.4) / 2;

            if (x >= pos.x && y >= pos.y) {
                setDragging(true);
            }
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    const handleMouseMove = (e) => {
        if (dragging) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left - image.width / 2;
            const y = e.clientY - rect.top - image.height / 2;
            const relativeX = (e.clientX - rect.left)
            const relativeY = (e.clientY - rect.top)

            let newX = "center";
            if (relativeX < 150) {
                newX = "left";
            } else if (relativeX > 230) {
                newX = "right";
            }

            let newY = "center";
            if (relativeY < 120) {
                newY = "top";
            } else if (relativeY > 280) {
                newY = "bottom";
            }
            setPos({x, y});
            setPosText((prevState) => ({...prevState, xText: newX, yText: newY}));
        }
    };

    const getCredits = async () => {
        const {data, error} = await supabase
            .from("credits")
            .select("credits")
            .eq("client_id", user?.id);

        if (data && data[0]) {
            setCredits(data[0].credits);
        } else {
            console.log("checkCredits() error", error);
        }
    };

    const subtractCredits = async () => {
        const {error} = await supabase
            .from("credits")
            .update({credits: credits - numberOfImages})
            .eq("client_id", user?.id);

        setCredits((prevState) => prevState - 3);

        if (error) {
            console.log(error);
        }
    };

    const generateImage = async (
        image: string,
        pos_prompt: string,
        neg_prompt: string,
        numberOfImages: number,
        imagePosition: { x: string; y: string },
        scaleFactor: number,
    ) => {
        try {
            const response = await fetch("/api/generateImage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image,
                    pos_prompt,
                    neg_prompt,
                    numberOfImages,
                    imagePosition,
                    scaleFactor
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const responseData = await response.json();
            //const responseData = dummyData


            // Save images to the database

            const { error } = await Promise.all(
                responseData.images.map(async (imageData: any) => {
                    return supabase.from("images").insert({
                        id: uuidv4(),
                        blob: imageData.image.data,
                        client_id: user.id,
                        uploaded_at: new Date().toISOString(),
                    });
                })
            );
            await subtractCredits();

            const processedImages = await responseData.images.map((imageData: any) => ({
                id: uuidv4(),
                blob: imageData.image.data,
                client_id: user.id,
                uploaded_at: new Date().toISOString(),
            }));


            // Merge the processed images with the existing media data

            setMedia((prevMedia) => [...processedImages,...prevMedia ]);

            if (error) {
                console.log(error);
            }
        } catch (error) {
            console.error(error.message, "generateImage() error message");
        }
    };

    const uploadToServer = async () => {
        if (imageId && userPrompt && credits >= numberOfImages) {
            await toast.promise(generateImage(
                imageId,
                userPrompt,
                negativeUserPrompt,
                numberOfImages,
                posText,
                scaleFactor
            ), {
                loading: 'Generating Image...', // Display loading spinner text
                success: 'Image successfully generated!', // Success toast message
                error: 'Image generation failed!', // Error toast message
            })

        } else {
            if (credits < numberOfImages)
            {
                toast('Not enough credits', {
                    duration: 2000,
                    icon: '❌'
                });
            }
            if (!userPrompt)
            {
                toast('The prompt is empty', {
                    duration: 2000,
                    icon: '❌'
                });
                console.log('shouls')
            }
            if (!imageId)
            {
                toast('No image uploaded', {
                    duration: 2000,
                    icon: '❌'
                });
            }
        }
        }




const handleNumberOfImages = (e) =>{
        setNumberOfImages(e)
}

    return (
        <div style={{flexDirection: 'column', display: 'flex'}}>
            <FrostedContainer style={{height: 400, width: 400, marginBottom: 15}}>
                {loading && (
                    <div
                        style={{
                            position: "absolute",
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'

                        }}
                    >
                        <GridLoader color={colors.primary}/>
                    </div>
                )}
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    width={400}
                    height={400}
                >
                    Canvas not supported
                </canvas>
            </FrostedContainer>
            {image && <div style={{display: 'flex', flexDirection: 'row', }}><h5 style={{marginRight: 20}}>Resize</h5> <Slider
                name="scaleFactor"
                value={scaleFactor}
                min={0.1}
                max={1}
                sx={{
                    width: 130,
                    '& .MuiSlider-thumb': {
                        color: 'purple',
                    },
                    '& .MuiSlider-rail': {
                        color: 'white'
                    },
                    '& .MuiSlider-track': {
                        color: 'white'
                    }
                }}
                step={0.1}
                onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
            /></div>}
{/*<button onClick={() => fileInput.current.click()} className={styles.uploadButton}>Upload</button>*/}
{/*            <input type="file" accept='image/*' className='input-field'*/}
{/*                   onChange={handleFileChange}*/}
{/*                   ref={fileInput}*/}
{/*                   style={{display: 'none'}}*/}
{/*            />*/}
            <input type="file" accept='image/*' className='input-field'
                   onChange={handleFileChange}


            />

            <input
                style={{
                    padding: 20,
                    fontFamily: "Roboto",
                    marginTop: 16,
                    height: 30,
                    width: 400,
                    alignSelf: "stretch",
                    backgroundColor: "#F6FAFF",
                    borderRadius: 20,
                    border: "none",
                    color: "black",
                }}
                type="text"
                placeholder="Insert your prompt here"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
            />
            <input
                style={{
                    padding: 20,
                    marginTop: 4,
                    height: 30,
                    backgroundColor: "#F6FAFF",
                    alignSelf: "stretch",
                    borderRadius: 20,
                    border: "none",
                    width: 400,
                    color: "black",
                }}
                type="text"
                placeholder="Insert your negative prompt here (optional)"
                value={negativeUserPrompt}
                onChange={(e) => setNegativeUserPrompt(e.target.value)}
            />
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h5 style={{marginTop: 24}}>Number of images</h5>

            <Slider
                name="brightness"
                value={numberOfImages}
                min={1}
                max={7}
                sx={{
                    marginTop: 2,
                    width: 400,

                    '& .MuiSlider-thumb': {
                        color: 'purple',
                    },
                    '& .MuiSlider-rail': {
                        color: 'white'
                    },
                    '& .MuiSlider-track': {
                        color: 'white'
                    }
                }}
                step={1}
                onChange={(e, value) => handleNumberOfImages(value)}
            />
            <p style={{marginLeft: 20, fontFamily: "roboto"}}>
                {numberOfImages}
            </p>

            <button
                style={{
                    width: 150,
                    padding: 10,
                    borderRadius: 25,
                    backgroundColor: "#EDF1FF",
                    color: "black",
                    border: "3px solid #581449",
                    marginTop: 12,
                    fontWeight: 'bold'
                }}
                className="btn btn-primary"
                type="submit"
                onClick={uploadToServer}
            >
                GENERATE
            </button>
            <h1>{credits}</h1>
            </div>
        </div>
    );
};

export default ImageEditor;
