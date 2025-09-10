import Image from "next/image";

const EntryImage = () => {
  return (
    <div className="hidden md:flex md:w-1/2 bg-[#0d3b7a] flex-col items-center justify-center p-10 h-screen">
      <div className="text-white m-[10vh_auto_0_2vw]">
        <p className="font-medium text-2xl tracking-tighter">
          흩어진 중개 업무,{" "}
        </p>
        <p className="font-medium text-2xl tracking-tighter">
          여기서 전부 관리해요!
        </p>
        <h2 className="mt-[10px] font-bold text-5xl tracking-wide">ZIPLINE</h2>
      </div>
      <div className="relative w-full h-full">
        <Image
          src={"/assets/contract.png"}
          alt="장식용 계약 이미지"
          width={250}
          height={250}
          quality={100}
          unoptimized
          className="absolute w-[17vw] min-w-[180px] top-[48%] left-[22%] transform -translate-x-1/2 -translate-y-1/2 -rotate-6 floating z-10"
        />
        <Image
          src={"/assets/house.png"}
          alt="장식용 집 이미지"
          width={400}
          height={380}
          quality={100}
          unoptimized
          className="absolute w-[25vw] min-w-[250px] top-[50%] left-[70%] transform -translate-x-1/2 -translate-y-1/2 rotate-4 floating"
        />
        <Image
          src={"/assets/counsel.png"}
          alt="장식용 상담 이미지"
          width={400}
          height={200}
          quality={100}
          unoptimized
          className="absolute w-[30vw] min-w-[300px] top-[80%] left-[40%] transform -translate-x-1/2 -translate-y-1/2 floating z-10"
        />
      </div>
    </div>
  );
};

export default EntryImage;
