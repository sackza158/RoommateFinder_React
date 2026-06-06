function PostItem(props){
    return(
        <div className="post-item">
            {props.post.image && (
                <img
                    src={props.post.image}
                    alt="room"
                    className="room-image"
                />
            )}
            <p>ชื่อหอพัก : {props.post.title}</p>
            <p className="price">ราคา : {props.post.price}/เดือน</p>
            <p>ประเภท : {props.post.roomtype}</p>

            <button onClick={() => props.onView(props.post)}>
                ดูรายละเอียด
            </button>

            <button onClick={() => props.onEdit(props.post)}>
                แก้ไข
            </button>

            <button onClick={() => props.onDelete(props.post.id)}>
                ลบ
            </button>

        </div>
    );
}

export default PostItem;