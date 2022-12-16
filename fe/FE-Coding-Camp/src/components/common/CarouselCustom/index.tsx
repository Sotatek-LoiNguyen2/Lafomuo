import { Image, Carousel } from "antd";
import React from "react";
import { getUrl } from "../../../utils/utility";
import style from "./CarouselCustom.module.scss";

export const configCarousel = {
  arrows: true,
  slidesToShow: 5,
  infinite: false,
  slidesToScroll: 5,
  responsive: [
    {
      breakpoint: 1440,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 1016,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 699,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
  nextArrow: (
    <div>
      <img src="/icons/arrow-right.svg" alt="" />
    </div>
  ),
  prevArrow: (
    <div>
      <img src="/icons/arrow-left.svg" alt="" />
    </div>
  ),
};

interface CarouselCustom {
  imagesData: any;
}
const CarouselCustom = ({ imagesData = [] }: CarouselCustom) => {
  return (
    <div className={style.carouselContainer}>
      <div className="slide">
        <Carousel {...configCarousel}>
          {imagesData.map((item: any, index: number) => {
            return <Image alt="" height={100} src={getUrl(item)} key={index} />;
          })}
        </Carousel>
      </div>
    </div>
  );
};

export default CarouselCustom;
